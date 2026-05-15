import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardForm from './CardForm';
import CardPreview from './CardPreview';
import { CardProvider } from '../context/CardContext';
import { getClubs, getNationalities, getLeagues } from '../services/api';
import { saveCard } from '../services/storage';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock('../services/api');
jest.mock('../services/storage');

const mockedClubs = [
  { id: 1, name: 'FC Test' },
  { id: 2, name: 'Unit United' },
];
const mockedNations = [
  { id: 1, name: 'Testland' },
  { id: 2, name: 'Mockistan' },
];
const mockedLeagues = [
  { id: 1, name: 'Test League' },
  { id: 2, name: 'Mock League' },
];

beforeEach(() => {
  (getClubs as jest.Mock).mockResolvedValue(mockedClubs);
  (getNationalities as jest.Mock).mockResolvedValue(mockedNations);
  (getLeagues as jest.Mock).mockResolvedValue(mockedLeagues);
  (saveCard as jest.Mock).mockClear();
});

describe('CardForm Component', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  const renderWithPreview = () =>
    render(
      <CardProvider>
        <CardForm />
        <CardPreview />
      </CardProvider>,
    );

  test('shows loading spinner before API data loads and hides afterwards', async () => {
    renderWithProvider();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(await screen.findByLabelText(/Player Name/i)).toBeInTheDocument();
  });

  test('populates dropdowns from API and updates player name field', async () => {
    renderWithProvider();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const nameInput = (await screen.findByLabelText(
      /Player Name/i,
    )) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Test Player' } });
    expect(nameInput.value).toBe('Test Player');

    // Verify dropdowns are populated
    expect(screen.getByTestId('club-select')).toBeInTheDocument();
    expect(screen.getByTestId('nationality-select')).toBeInTheDocument();
    expect(screen.getByTestId('league-select')).toBeInTheDocument();
  });

  test('randomize button sets stats in 0-100 range', async () => {
    renderWithProvider();

    await screen.findByLabelText(/Defence/i);

    const attack = screen.getByLabelText(/Attack/i) as HTMLInputElement;
    const control = screen.getByLabelText(/Control/i) as HTMLInputElement;
    const defence = screen.getByLabelText(/Defence/i) as HTMLInputElement;

    const randomize = screen.getByRole('button', { name: /randomize stats/i });
    fireEvent.click(randomize);

    await waitFor(() => {
      expect(Number(defence.value)).toBeGreaterThanOrEqual(0);
    });
    expect(Number(defence.value)).toBeLessThanOrEqual(100);
    expect(Number(control.value)).toBeGreaterThanOrEqual(0);
    expect(Number(control.value)).toBeLessThanOrEqual(100);
    expect(Number(attack.value)).toBeGreaterThanOrEqual(0);
    expect(Number(attack.value)).toBeLessThanOrEqual(100);
  });

  test('shows validation error for invalid URL', async () => {
    renderWithProvider();

    const urlInput = (await screen.findByTestId(
      'photo-url',
    )) as HTMLInputElement;
    fireEvent.change(urlInput, { target: { value: 'ftp://badurl.notimg' } });

    fireEvent.click(screen.getByTestId('set-url'));

    expect(await screen.findByText(/Invalid image URL/i)).toBeInTheDocument();
  });

  test('shows validation error when saving without player name', async () => {
    renderWithProvider();

    const nameInput = (await screen.findByLabelText(
      /Player Name/i,
    )) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Card/i }));

    expect(
      await screen.findByText(/Player name is required/i),
    ).toBeInTheDocument();
    expect(saveCard).not.toHaveBeenCalled();
  });

  test('saves card when valid and calls storage.saveCard', async () => {
    renderWithProvider();

    const nameInput = (await screen.findByLabelText(
      /Player Name/i,
    )) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'SaveTester' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Card/i }));

    expect(
      await screen.findByText(/Card saved successfully/i),
    ).toBeInTheDocument();
    expect(saveCard).toHaveBeenCalled();
  });

  test('displays error message when API calls fail', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (getClubs as jest.Mock).mockRejectedValue(
      new Error('Network Error: Failed to fetch /api/v1/clubs'),
    );

    renderWithProvider();

    const errorText = await screen.findByText(/Failed to fetch data/i);
    expect(errorText).toBeInTheDocument();
    expect(errorText.textContent).toContain(
      'ensure the backend API is running',
    );

    consoleErrorSpy.mockRestore();
  });

  test('loads dropdowns successfully when API calls succeed', async () => {
    renderWithProvider();

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Verify API functions were called
    expect(getClubs).toHaveBeenCalled();
    expect(getNationalities).toHaveBeenCalled();
    expect(getLeagues).toHaveBeenCalled();

    // Verify form elements are in the document (selects, inputs, buttons)
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(3);
    expect(
      screen.getByRole('button', { name: /randomize stats/i }),
    ).toBeInTheDocument();
  });

  test('selects background option when clicked', async () => {
    renderWithPreview();

    // Wait for form to load
    await screen.findByLabelText(/Player Name/i);

    const stadiumBlueImage = screen.getByAltText('Stadium Blue');
    expect(stadiumBlueImage).toBeInTheDocument();
    fireEvent.click(stadiumBlueImage);

    const previewCard = await screen.findByTestId('card-preview');
    const backgroundImage = previewCard.dataset.backgroundImage || '';
    const backgroundCss = previewCard.dataset.backgroundCss || '';

    expect(backgroundImage).toContain('picsum.photos/300/200?random=2');
    expect(backgroundCss).toContain('linear-gradient');
  });

  test('updates background selection and reflects in preview', async () => {
    renderWithPreview();

    await screen.findByLabelText(/Player Name/i);

    const classicGreenImage = screen.getByAltText('Classic Green');
    const stadiumBlueImage = screen.getByAltText('Stadium Blue');

    fireEvent.click(classicGreenImage);

    let previewCard = await screen.findByTestId('card-preview');
    let backgroundImage = previewCard.dataset.backgroundImage || '';
    expect(backgroundImage).toContain('picsum.photos/300/200?random=1');

    fireEvent.click(stadiumBlueImage);

    previewCard = await screen.findByTestId('card-preview');
    backgroundImage = previewCard.dataset.backgroundImage || '';
    expect(backgroundImage).toContain('picsum.photos/300/200?random=2');
  });

  test('displays semi-transparent gradient overlay with background', async () => {
    renderWithPreview();

    await screen.findByLabelText(/Player Name/i);

    const stadiumBlueImage = screen.getByAltText('Stadium Blue');
    fireEvent.click(stadiumBlueImage);

    const previewCard = await screen.findByTestId('card-preview');
    const backgroundImage = previewCard.dataset.backgroundImage || '';
    const backgroundCss = previewCard.dataset.backgroundCss || '';

    expect(backgroundCss).toContain('linear-gradient');
    expect(backgroundCss).toContain('rgba(25, 118, 210, 0.7)');
    expect(backgroundCss).toContain('rgba(255, 193, 7, 0.7)');
    expect(backgroundImage).toContain('picsum.photos/300/200?random=2');
  });
});
