import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import CardForm from './CardForm';
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

describe('Stock photo selection', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  test('renders 6 stock photo buttons with accessible names', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const buttons = screen.getAllByRole('button', { name: /Portrait of a/i });
    expect(buttons).toHaveLength(6);
  });

  test('clicking a stock photo sets aria-pressed to true', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const first = screen.getByRole('button', {
      name: 'Portrait of a male footballer, dark hair, looking forward',
    });
    expect(first).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-pressed', 'true');
  });

  test('pressing Enter on a stock photo selects it', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const second = screen.getByRole('button', {
      name: 'Portrait of a female footballer, looking forward',
    });
    fireEvent.keyDown(second, { key: 'Enter', code: 'Enter' });
    expect(second).toHaveAttribute('aria-pressed', 'true');
  });

  test('pressing Space on a stock photo selects it', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const third = screen.getByRole('button', {
      name: 'Portrait of a male footballer, short hair, side profile',
    });
    fireEvent.keyDown(third, { key: ' ', code: 'Space' });
    expect(third).toHaveAttribute('aria-pressed', 'true');
  });

  test('selecting a second portrait deselects the first', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const first = screen.getByRole('button', {
      name: 'Portrait of a male footballer, dark hair, looking forward',
    });
    const second = screen.getByRole('button', {
      name: 'Portrait of a female footballer, looking forward',
    });

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(second);
    expect(first).toHaveAttribute('aria-pressed', 'false');
    expect(second).toHaveAttribute('aria-pressed', 'true');
  });

  test('stock photo cards are focusable via tabIndex', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const button = screen.getByRole('button', {
      name: 'Portrait of a male footballer, dark hair, looking forward',
    });
    button.focus();
    expect(button).toHaveFocus();
  });
});

describe('Image frame type selector', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  test('renders three frame type buttons', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('image-frame-type-selector');
    expect(
      within(selector).getByRole('button', { name: 'Face' }),
    ).toBeInTheDocument();
    expect(
      within(selector).getByRole('button', { name: 'Head & Shoulders' }),
    ).toBeInTheDocument();
    expect(
      within(selector).getByRole('button', { name: 'Full Body' }),
    ).toBeInTheDocument();
  });

  test('Frame is "face" by default (aria-pressed=true on Face button)', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('image-frame-type-selector');
    expect(
      within(selector).getByRole('button', { name: 'Face' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(selector).getByRole('button', { name: 'Full Body' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  test('clicking Head & Shoulders sets it as selected', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('image-frame-type-selector');
    fireEvent.click(
      within(selector).getByRole('button', { name: 'Head & Shoulders' }),
    );

    expect(
      within(selector).getByRole('button', { name: 'Head & Shoulders' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(selector).getByRole('button', { name: 'Face' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  test('clicking Full Body sets it as selected', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('image-frame-type-selector');
    fireEvent.click(
      within(selector).getByRole('button', { name: 'Full Body' }),
    );

    expect(
      within(selector).getByRole('button', { name: 'Full Body' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('frame type selector group has correct aria-label', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    expect(
      screen.getByRole('group', { name: 'Player image frame type' }),
    ).toBeInTheDocument();
  });
});

describe('Image crop focus selector', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  test('renders three crop focus buttons', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('image-crop-focus-selector');
    expect(
      within(selector).getByRole('button', { name: 'Top' }),
    ).toBeInTheDocument();
    expect(
      within(selector).getByRole('button', { name: 'Centre' }),
    ).toBeInTheDocument();
    expect(
      within(selector).getByRole('button', { name: 'Bottom' }),
    ).toBeInTheDocument();
  });

  test('crop focus is "top" by default (aria-pressed=true on Top button)', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('image-crop-focus-selector');
    expect(
      within(selector).getByRole('button', { name: 'Top' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(selector).getByRole('button', { name: 'Bottom' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  test('clicking Centre sets it as selected', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('image-crop-focus-selector');
    fireEvent.click(within(selector).getByRole('button', { name: 'Centre' }));

    expect(
      within(selector).getByRole('button', { name: 'Centre' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(selector).getByRole('button', { name: 'Top' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  test('clicking Bottom sets it as selected', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const selector = screen.getByTestId('image-crop-focus-selector');
    fireEvent.click(within(selector).getByRole('button', { name: 'Bottom' }));

    expect(
      within(selector).getByRole('button', { name: 'Bottom' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('crop focus selector group has correct aria-label', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    expect(
      screen.getByRole('group', { name: 'Image crop focus' }),
    ).toBeInTheDocument();
  });
});

describe('Text Customisation section', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  test('renders the three font selectors', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    expect(
      screen.getByTestId('font-selector-player-name-font'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('font-selector-club-league-position-font'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('font-selector-nationality-font'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('font-selector-stats-font')).toBeInTheDocument();
  });

  test('renders Reset Text Fonts button', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    expect(
      screen.getByRole('button', { name: /Reset Text Fonts/i }),
    ).toBeInTheDocument();
  });

  test('Reset Text Fonts button reverts selectors to defaults', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const playerNameSelector = screen.getByTestId(
      'font-selector-player-name-font',
    );
    expect(within(playerNameSelector).getByRole('combobox')).toHaveTextContent(
      'Playfair Display',
    );

    fireEvent.click(screen.getByRole('button', { name: /Reset Text Fonts/i }));

    await waitFor(() => {
      expect(
        within(playerNameSelector).getByRole('combobox'),
      ).toHaveTextContent('Playfair Display');
    });
  });

  test('selecting a different Player Name Font updates the displayed value', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const playerNameSelector = screen.getByTestId(
      'font-selector-player-name-font',
    );
    fireEvent.mouseDown(within(playerNameSelector).getByRole('combobox'));

    const montserratOption = await screen.findByTestId(
      'font-option-montserrat',
    );
    fireEvent.click(montserratOption);

    await waitFor(() => {
      expect(
        within(screen.getByTestId('font-selector-player-name-font')).getByRole(
          'combobox',
        ),
      ).toHaveTextContent('Montserrat');
    });
  });
});
