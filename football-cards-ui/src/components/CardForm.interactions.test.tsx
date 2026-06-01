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

describe('per-stat randomise buttons', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  test('randomise-defence changes only defence, leaving control and attack unchanged', async () => {
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.75);

    renderWithProvider();
    await screen.findByTestId('defence-input');

    const defence = screen.getByTestId('defence-input') as HTMLInputElement;
    const control = screen.getByTestId('control-input') as HTMLInputElement;
    const attack = screen.getByTestId('attack-input') as HTMLInputElement;

    fireEvent.click(screen.getByTestId('randomize-defence'));

    await waitFor(() => expect(Number(defence.value)).toBe(75));
    expect(Number(control.value)).toBe(50);
    expect(Number(attack.value)).toBe(50);

    mockRandom.mockRestore();
  });

  test('randomise-control changes only control, leaving defence and attack unchanged', async () => {
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.6);

    renderWithProvider();
    await screen.findByTestId('defence-input');

    const defence = screen.getByTestId('defence-input') as HTMLInputElement;
    const control = screen.getByTestId('control-input') as HTMLInputElement;
    const attack = screen.getByTestId('attack-input') as HTMLInputElement;

    fireEvent.click(screen.getByTestId('randomize-control'));

    await waitFor(() => expect(Number(control.value)).toBe(60));
    expect(Number(defence.value)).toBe(50);
    expect(Number(attack.value)).toBe(50);

    mockRandom.mockRestore();
  });

  test('randomise-attack changes only attack, leaving defence and control unchanged', async () => {
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.3);

    renderWithProvider();
    await screen.findByTestId('defence-input');

    const defence = screen.getByTestId('defence-input') as HTMLInputElement;
    const control = screen.getByTestId('control-input') as HTMLInputElement;
    const attack = screen.getByTestId('attack-input') as HTMLInputElement;

    fireEvent.click(screen.getByTestId('randomize-attack'));

    await waitFor(() => expect(Number(attack.value)).toBe(30));
    expect(Number(defence.value)).toBe(50);
    expect(Number(control.value)).toBe(50);

    mockRandom.mockRestore();
  });

  test('per-stat randomise buttons produce values in 0-100 range', async () => {
    renderWithProvider();
    await screen.findByTestId('defence-input');

    const defence = screen.getByTestId('defence-input') as HTMLInputElement;
    const control = screen.getByTestId('control-input') as HTMLInputElement;
    const attack = screen.getByTestId('attack-input') as HTMLInputElement;

    fireEvent.click(screen.getByTestId('randomize-defence'));
    fireEvent.click(screen.getByTestId('randomize-control'));
    fireEvent.click(screen.getByTestId('randomize-attack'));

    await waitFor(() => {
      expect(Number(defence.value)).toBeGreaterThanOrEqual(0);
    });
    expect(Number(defence.value)).toBeLessThanOrEqual(100);
    expect(Number(control.value)).toBeGreaterThanOrEqual(0);
    expect(Number(control.value)).toBeLessThanOrEqual(100);
    expect(Number(attack.value)).toBeGreaterThanOrEqual(0);
    expect(Number(attack.value)).toBeLessThanOrEqual(100);
  });
});

describe('reset player photo button', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  test('reset-player-photo is disabled initially when no photo is set', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    expect(screen.getByTestId('reset-player-photo')).toBeDisabled();
  });

  test('reset-player-photo enables after selecting a stock photo and disables again on click', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    fireEvent.click(screen.getByTestId('stock-photo-stock1'));

    await waitFor(() => {
      expect(screen.getByTestId('reset-player-photo')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByTestId('reset-player-photo'));

    await waitFor(() => {
      expect(screen.getByTestId('reset-player-photo')).toBeDisabled();
    });
  });
});

describe('reset card background button', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  test('reset-card-background is disabled initially when no background is set', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    expect(screen.getByTestId('reset-card-background')).toBeDisabled();
  });

  test('reset-card-background enables after selecting a background and disables again on click', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    fireEvent.click(
      screen.getByAltText('Stadium Blue: blue sky over a stadium'),
    );

    await waitFor(() => {
      expect(screen.getByTestId('reset-card-background')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByTestId('reset-card-background'));

    await waitFor(() => {
      expect(screen.getByTestId('reset-card-background')).toBeDisabled();
    });
  });
});

describe('Card type toggle', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  const waitForFormReady = async () => {
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  };

  test('defaults to Club mode with club and league selects visible', async () => {
    const { container } = renderWithProvider();
    await waitForFormReady();

    const selector = screen.getByTestId('card-type-selector');
    expect(
      within(selector).getByRole('button', { name: 'Club card' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(selector).getByRole('button', { name: 'National team card' }),
    ).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('club-select')).toBeInTheDocument();
    expect(screen.getByTestId('league-select')).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });

  test('switching to National Team hides Club and League selects', async () => {
    renderWithProvider();
    await waitForFormReady();

    const selector = screen.getByTestId('card-type-selector');
    fireEvent.click(
      within(selector).getByRole('button', { name: 'National team card' }),
    );

    await waitFor(() => {
      expect(screen.queryByTestId('club-select')).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId('league-select')).not.toBeInTheDocument();
  });

  test('switching to National Team keeps Nationality and Position selects visible', async () => {
    renderWithProvider();
    await waitForFormReady();

    const selector = screen.getByTestId('card-type-selector');
    fireEvent.click(
      within(selector).getByRole('button', { name: 'National team card' }),
    );

    await waitFor(() => {
      expect(screen.queryByTestId('club-select')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('nationality-select')).toBeInTheDocument();
    expect(screen.getByTestId('position-select')).toBeInTheDocument();
  });

  test('switching back to Club restores Club and League selects', async () => {
    renderWithProvider();
    await waitForFormReady();

    const selector = screen.getByTestId('card-type-selector');

    fireEvent.click(
      within(selector).getByRole('button', { name: 'National team card' }),
    );
    await waitFor(() => {
      expect(screen.queryByTestId('club-select')).not.toBeInTheDocument();
    });

    fireEvent.click(
      within(selector).getByRole('button', { name: 'Club card' }),
    );
    expect(await screen.findByTestId('club-select')).toBeInTheDocument();
    expect(screen.getByTestId('league-select')).toBeInTheDocument();
  });

  test('switching to National Team clears any previously selected club and league', async () => {
    renderWithProvider();
    await waitForFormReady();

    // Select a real club (Arsenal FC → auto-populates Mock League)
    const clubSelect = screen.getByTestId('club-select');
    fireEvent.mouseDown(within(clubSelect).getByRole('combobox'));
    fireEvent.click(await screen.findByRole('option', { name: 'Arsenal FC' }));

    // Verify league was auto-populated
    expect(
      within(screen.getByTestId('league-select')).getByRole('combobox'),
    ).toHaveTextContent('Mock League');

    // Switch to National Team
    const selector = screen.getByTestId('card-type-selector');
    fireEvent.click(
      within(selector).getByRole('button', { name: 'National team card' }),
    );

    // Club and League sections should be gone
    await waitFor(() => {
      expect(screen.queryByTestId('club-select')).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId('league-select')).not.toBeInTheDocument();

    // Switching back to Club should show empty selects (values were cleared)
    fireEvent.click(
      within(selector).getByRole('button', { name: 'Club card' }),
    );
    await screen.findByTestId('club-select');
    expect(
      within(screen.getByTestId('club-select')).getByRole('combobox'),
    ).not.toHaveTextContent('Arsenal FC');
    expect(
      within(screen.getByTestId('league-select')).getByRole('combobox'),
    ).not.toHaveTextContent('Mock League');
  });

  test('reset fields does not change card type when in National Team mode', async () => {
    renderWithProvider();
    await waitForFormReady();

    const selector = screen.getByTestId('card-type-selector');
    fireEvent.click(
      within(selector).getByRole('button', { name: 'National team card' }),
    );
    await waitFor(() => {
      expect(screen.queryByTestId('club-select')).not.toBeInTheDocument();
    });

    // Reset fields — card type should remain National Team
    fireEvent.click(screen.getByTestId('reset-fields'));

    await waitFor(() => {
      expect(
        within(screen.getByTestId('card-type-selector')).getByRole('button', {
          name: 'National team card',
        }),
      ).toHaveAttribute('aria-pressed', 'true');
    });
    expect(screen.queryByTestId('club-select')).not.toBeInTheDocument();
  });
});

describe('reset fields button', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  test('reset-fields clears playerName input', async () => {
    renderWithProvider();
    const nameInput = (await screen.findByLabelText(
      'Player Name',
    )) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'Test Player' } });
    expect(nameInput.value).toBe('Test Player');

    fireEvent.click(screen.getByTestId('reset-fields'));

    await waitFor(() => {
      expect(nameInput.value).toBe('');
    });
  });

  test('reset-fields resets all three stats to 50', async () => {
    renderWithProvider();
    await screen.findByTestId('defence-input');

    const defence = screen.getByTestId('defence-input') as HTMLInputElement;
    const control = screen.getByTestId('control-input') as HTMLInputElement;
    const attack = screen.getByTestId('attack-input') as HTMLInputElement;

    fireEvent.change(defence, { target: { value: '90' } });
    fireEvent.change(control, { target: { value: '85' } });
    fireEvent.change(attack, { target: { value: '95' } });

    fireEvent.click(screen.getByTestId('reset-fields'));

    await waitFor(() => {
      expect(Number(defence.value)).toBe(50);
    });
    expect(Number(control.value)).toBe(50);
    expect(Number(attack.value)).toBe(50);
  });

  test('reset-fields does not clear player photo', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    fireEvent.click(screen.getByTestId('stock-photo-stock1'));
    await waitFor(() => {
      expect(screen.getByTestId('reset-player-photo')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByTestId('reset-fields'));

    await waitFor(() => {
      expect(screen.getByTestId('reset-player-photo')).not.toBeDisabled();
    });
  });

  test('reset-fields does not clear card background', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    fireEvent.click(
      screen.getByAltText('Stadium Blue: blue sky over a stadium'),
    );
    await waitFor(() => {
      expect(screen.getByTestId('reset-card-background')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByTestId('reset-fields'));

    await waitFor(() => {
      expect(screen.getByTestId('reset-card-background')).not.toBeDisabled();
    });
  });
});
