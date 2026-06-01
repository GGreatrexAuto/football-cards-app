import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import CardForm from './CardForm';
import CardPreview from './CardPreview';
import { CardProvider } from '../context/CardContext';
import {
  getClubs,
  getNationalities,
  getLeagues,
  getPositions,
} from '../services/api';
import { saveCard } from '../services/storage';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock('../services/api');
jest.mock('../services/storage');

const mockedClubs = [
  { id: 1, name: 'Unit United', league_id: 1, league_name: 'Test League' },
  { id: 2, name: 'Arsenal FC', league_id: 2, league_name: 'Mock League' },
  { id: 3, name: 'FC Test', league_id: 1, league_name: 'Test League' },
];
const mockedNations = [
  { id: 1, name: 'Testland' },
  { id: 2, name: 'Mockistan' },
];
const mockedLeagues = [
  { id: 1, name: 'Test League' },
  { id: 2, name: 'Mock League' },
];
const mockedPositions = [
  { code: 'GK', name: 'Goalkeeper' },
  { code: 'FWD', name: 'Forward' },
];

beforeEach(() => {
  (getClubs as jest.Mock).mockResolvedValue(mockedClubs);
  (getNationalities as jest.Mock).mockResolvedValue(mockedNations);
  (getLeagues as jest.Mock).mockResolvedValue(mockedLeagues);
  (getPositions as jest.Mock).mockResolvedValue(mockedPositions);
  (saveCard as jest.Mock).mockClear();
});

const originalConsoleError = console.error;
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
    if (typeof msg === 'string' && msg.includes('not wrapped in act')) return;
    originalConsoleError(msg, ...args);
  });
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe('Nationality flag display mode', () => {
  const mockedNationsWithCodes = [
    { id: 1, name: 'England', country_code: 'ENG' },
    { id: 2, name: 'Testland' },
  ];

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

  beforeEach(() => {
    (getClubs as jest.Mock).mockResolvedValue([]);
    (getNationalities as jest.Mock).mockResolvedValue(mockedNationsWithCodes);
    (getLeagues as jest.Mock).mockResolvedValue([]);
    (getPositions as jest.Mock).mockResolvedValue([]);
    (saveCard as jest.Mock).mockClear();
  });

  const selectNationality = async (name: string) => {
    const nationalitySelect = screen.getByTestId('nationality-select');
    fireEvent.mouseDown(within(nationalitySelect).getByRole('combobox'));
    fireEvent.click(await screen.findByRole('option', { name }));
  };

  test('display mode toggle is not shown before a nationality is selected', async () => {
    renderWithProvider();
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    expect(
      screen.queryByTestId('nationality-display-selector'),
    ).not.toBeInTheDocument();
  });

  test('display mode toggle appears after a nationality is selected', async () => {
    renderWithProvider();
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    await selectNationality('England');
    expect(
      await screen.findByTestId('nationality-display-selector'),
    ).toBeInTheDocument();
  });

  test('each toggle button has the correct aria-label', async () => {
    renderWithProvider();
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    await selectNationality('England');
    await screen.findByTestId('nationality-display-selector');
    expect(
      screen.getByRole('button', { name: 'Show text only' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Show flag only' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Show flag and text' }),
    ).toBeInTheDocument();
  });

  test('selecting Flag mode shows flag on preview and hides text', async () => {
    renderWithPreview();
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    await selectNationality('England');
    fireEvent.click(
      await screen.findByRole('button', { name: 'Show flag only' }),
    );
    expect(await screen.findByTestId('nationality-flag')).toBeInTheDocument();
    expect(screen.queryByTestId('nationality-text')).not.toBeInTheDocument();
  });

  test('selecting Both mode shows flag and text on preview', async () => {
    renderWithPreview();
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    await selectNationality('England');
    fireEvent.click(
      await screen.findByRole('button', { name: 'Show flag and text' }),
    );
    expect(await screen.findByTestId('nationality-flag')).toBeInTheDocument();
    expect(screen.getByTestId('nationality-text')).toBeInTheDocument();
  });

  test('Flag and Both buttons are disabled for nationality with no flag', async () => {
    renderWithProvider();
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    await selectNationality('Testland');
    await screen.findByTestId('nationality-display-selector');
    expect(
      screen.getByRole('button', { name: 'Show flag only' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Show flag and text' }),
    ).toBeDisabled();
  });

  test('has no accessibility violations when toggle is visible', async () => {
    const { container } = renderWithProvider();
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    await selectNationality('England');
    await screen.findByTestId('nationality-display-selector');
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Card Border section', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
        <CardPreview />
      </CardProvider>,
    );

  test('renders the Card Border shape selector', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    expect(
      screen.getByTestId('card-border-shape-selector'),
    ).toBeInTheDocument();
  });

  test('renders all five shape buttons', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('card-border-shape-selector');
    expect(
      within(selector).getByRole('button', { name: 'None border' }),
    ).toBeInTheDocument();
    expect(
      within(selector).getByRole('button', { name: 'Rectangle border' }),
    ).toBeInTheDocument();
    expect(
      within(selector).getByRole('button', { name: 'Shield border' }),
    ).toBeInTheDocument();
    expect(
      within(selector).getByRole('button', { name: 'Triangle border' }),
    ).toBeInTheDocument();
    expect(
      within(selector).getByRole('button', { name: 'Explosion border' }),
    ).toBeInTheDocument();
  });

  test('None is selected by default', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('card-border-shape-selector');
    expect(
      within(selector).getByRole('button', { name: 'None border' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('colour picker is hidden when shape is None', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    expect(
      screen.queryByTestId('card-border-color-picker'),
    ).not.toBeInTheDocument();
  });

  test('colour picker appears when a non-None shape is selected', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('card-border-shape-selector');
    fireEvent.click(
      within(selector).getByRole('button', { name: 'Shield border' }),
    );

    expect(
      await screen.findByTestId('card-border-color-picker'),
    ).toBeInTheDocument();
  });

  test('selecting Shield renders SVG border overlay on the card preview', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('card-border-shape-selector');
    fireEvent.click(
      within(selector).getByRole('button', { name: 'Shield border' }),
    );

    expect(
      await screen.findByTestId('card-border-overlay'),
    ).toBeInTheDocument();
  });

  test('selecting None after a shape removes the border overlay', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('card-border-shape-selector');
    fireEvent.click(
      within(selector).getByRole('button', { name: 'Triangle border' }),
    );
    await screen.findByTestId('card-border-overlay');

    fireEvent.click(
      within(selector).getByRole('button', { name: 'None border' }),
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId('card-border-overlay'),
      ).not.toBeInTheDocument();
    });
  });

  test('has no accessibility violations with border section visible', async () => {
    const { container } = renderWithProvider();
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
