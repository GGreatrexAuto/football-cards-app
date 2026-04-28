import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardForm from './CardForm';
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

    await screen.findByText(/Club/i);

    const nameInput = (await screen.findByLabelText(
      /Player Name/i,
    )) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Test Player' } });
    expect(nameInput.value).toBe('Test Player');

    const clubSelect = screen.getAllByRole('combobox')[0];
    fireEvent.mouseDown(clubSelect);

    await screen.findByText('FC Test');
    fireEvent.click(screen.getByText('FC Test'));
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

    const urlInput = (await screen.findByLabelText(
      /Photo URL/i,
    )) as HTMLInputElement;
    fireEvent.change(urlInput, { target: { value: 'ftp://badurl.notimg' } });

    fireEvent.click(screen.getByRole('button', { name: /Set URL/i }));

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
});
