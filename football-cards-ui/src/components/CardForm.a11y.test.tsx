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

describe('Form Semantics — Accessibility', () => {
  const renderComponent = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  const waitForForm = async () => {
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  };

  test('Player Name input has aria-required="true"', async () => {
    renderComponent();
    await waitForForm();
    expect(screen.getByTestId('player-name')).toHaveAttribute(
      'aria-required',
      'true',
    );
  });

  test('Player Name input has aria-invalid="true" when save attempted without a name', async () => {
    renderComponent();
    await waitForForm();

    fireEvent.click(screen.getByRole('button', { name: /Save Card/i }));

    await waitFor(() => {
      expect(screen.getByTestId('player-name')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });
  });

  test('Player Name aria-invalid is cleared after typing a name', async () => {
    renderComponent();
    await waitForForm();

    fireEvent.click(screen.getByRole('button', { name: /Save Card/i }));
    await waitFor(() => {
      expect(screen.getByTestId('player-name')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    fireEvent.change(screen.getByTestId('player-name'), {
      target: { value: 'Test Player' },
    });

    expect(screen.getByTestId('player-name')).toHaveAttribute(
      'aria-invalid',
      'false',
    );
  });

  test('Player Name has aria-describedby linking to the visible error message', async () => {
    renderComponent();
    await waitForForm();

    fireEvent.click(screen.getByRole('button', { name: /Save Card/i }));

    const input = screen.getByTestId('player-name');
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const errorEl = screen.getByText(/player name is required/i);
    expect(errorEl).toHaveAttribute('id', describedBy!);
  });

  test('defence input has aria-invalid="true" when value exceeds 100', async () => {
    renderComponent();
    await waitForForm();

    fireEvent.change(screen.getByTestId('defence-input'), {
      target: { value: '150' },
    });

    expect(screen.getByTestId('defence-input')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  test('stats section is wrapped in a fieldset with accessible name "Player Stats"', async () => {
    renderComponent();
    await waitForForm();

    expect(
      screen.getByRole('group', { name: 'Player Stats' }),
    ).toBeInTheDocument();
  });

  test('error Alert has role="alert" and aria-live="assertive"', async () => {
    renderComponent();
    await waitForForm();

    fireEvent.change(screen.getByTestId('player-name'), {
      target: { value: 'Test Player' },
    });
    fireEvent.change(screen.getByTestId('defence-input'), {
      target: { value: '150' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Card/i }));

    const errorAlert = await screen.findByTestId('error-message');
    expect(errorAlert).toHaveAttribute('role', 'alert');
    expect(errorAlert).toHaveAttribute('aria-live', 'assertive');
  });

  test('custom club input has an accessible label when it appears', async () => {
    renderComponent();
    await waitForForm();

    const clubSelect = screen.getByTestId('club-select');
    const combobox = within(clubSelect).getByRole('combobox');
    fireEvent.mouseDown(combobox);

    const otherOption = await screen.findByRole('option', {
      name: /Other.*enter club name/i,
    });
    fireEvent.click(otherOption);

    const customInput = await screen.findByTestId('custom-club-input');
    expect(customInput).toHaveAttribute('aria-label', 'Custom Club Name');
  });
});

describe('Image & media alt text — 17.7', () => {
  const renderForm = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  test('stock photo images have descriptive alt text (not generic "Player Portrait N")', async () => {
    renderForm();

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );

    const stockSection = screen.getByTestId('stock-photos');
    const imgs = within(stockSection).getAllByRole('img');

    imgs.forEach((img) => {
      const alt = img.getAttribute('alt') ?? '';
      expect(alt).not.toMatch(/^Player Portrait \d$/i);
      expect(alt.length).toBeGreaterThan(20);
    });
  });

  test('background option images have descriptive alt text', async () => {
    renderForm();

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );

    const classicGreenCard = screen.getByTestId('background-classic-green');
    const stadiumBlueCard = screen.getByTestId('background-stadium-blue');
    const championsGoldCard = screen.getByTestId('background-champions-gold');

    expect(within(classicGreenCard).getByRole('img')).toHaveAttribute(
      'alt',
      'Classic Green: green grass football pitch',
    );
    expect(within(stadiumBlueCard).getByRole('img')).toHaveAttribute(
      'alt',
      'Stadium Blue: blue sky over a stadium',
    );
    expect(within(championsGoldCard).getByRole('img')).toHaveAttribute(
      'alt',
      'Champions Gold: golden confetti celebration',
    );
  });
});

describe('Loading state accessibility — 17.8', () => {
  test('role="status" region contains loading text while API calls are in flight', () => {
    // Keep API calls pending indefinitely
    (getClubs as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toBeInTheDocument();
    expect(statusRegion).toHaveTextContent(/loading form options/i);
  });

  test('status region is removed once data has loaded', async () => {
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('role="alert" region announces error when API call fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (getClubs as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    const alertRegion = await screen.findByRole('alert');
    expect(alertRegion).toBeInTheDocument();
    expect(alertRegion).toHaveTextContent(/failed|error/i);
  });
});

describe('Stats Style selector', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  const waitForForm = async () => {
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  };

  test('renders Adrenaline and Match Atk toggle buttons', async () => {
    renderWithProvider();
    await waitForForm();

    expect(
      screen.getByRole('button', { name: /Adrenaline style/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Match Atk style/i }),
    ).toBeInTheDocument();
  });

  test('Adrenaline inputs are visible by default', async () => {
    renderWithProvider();
    await waitForForm();

    expect(screen.getByTestId('defence-input')).toBeInTheDocument();
    expect(screen.getByTestId('control-input')).toBeInTheDocument();
    expect(screen.getByTestId('attack-input')).toBeInTheDocument();
    expect(screen.queryByTestId('speed-input')).not.toBeInTheDocument();
  });

  test('switching to Match Atk shows Match Atk inputs and hides Adrenaline inputs', async () => {
    renderWithProvider();
    await waitForForm();

    fireEvent.click(screen.getByRole('button', { name: /Match Atk style/i }));

    await screen.findByTestId('speed-input');
    expect(screen.getByTestId('tackle-input')).toBeInTheDocument();
    expect(screen.getByTestId('power-input')).toBeInTheDocument();
    expect(screen.getByTestId('shoot-input')).toBeInTheDocument();
    expect(screen.getByTestId('skill-input')).toBeInTheDocument();
    expect(screen.getByTestId('pass-input')).toBeInTheDocument();
    expect(screen.queryByTestId('defence-input')).not.toBeInTheDocument();
  });

  test('switching to Match Atk resets Match Atk stats to 50', async () => {
    renderWithProvider();
    await waitForForm();

    fireEvent.click(screen.getByRole('button', { name: /Match Atk style/i }));

    const speed = (await screen.findByTestId(
      'speed-input',
    )) as HTMLInputElement;
    expect(Number(speed.value)).toBe(50);
  });

  test('switching back to Adrenaline shows Adrenaline inputs again', async () => {
    renderWithProvider();
    await waitForForm();

    fireEvent.click(screen.getByRole('button', { name: /Match Atk style/i }));
    await screen.findByTestId('speed-input');

    fireEvent.click(screen.getByRole('button', { name: /Adrenaline style/i }));
    await screen.findByTestId('defence-input');
    expect(screen.queryByTestId('speed-input')).not.toBeInTheDocument();
  });

  test('randomize stats button randomizes Match Atk stats when style is matchAtk', async () => {
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.8);

    renderWithProvider();
    await waitForForm();

    fireEvent.click(screen.getByRole('button', { name: /Match Atk style/i }));
    await screen.findByTestId('speed-input');

    fireEvent.click(screen.getByTestId('randomize-stats'));

    await waitFor(() => {
      const speed = screen.getByTestId('speed-input') as HTMLInputElement;
      expect(Number(speed.value)).toBe(80);
    });

    mockRandom.mockRestore();
  });

  test('per-stat randomise buttons work for Match Atk inputs', async () => {
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.65);

    renderWithProvider();
    await waitForForm();

    fireEvent.click(screen.getByRole('button', { name: /Match Atk style/i }));
    await screen.findByTestId('speed-input');

    fireEvent.click(screen.getByTestId('randomize-speed'));

    await waitFor(() => {
      const speed = screen.getByTestId('speed-input') as HTMLInputElement;
      expect(Number(speed.value)).toBe(65);
    });

    mockRandom.mockRestore();
  });

  test('shoot-input has aria-invalid="true" when value exceeds 100', async () => {
    renderWithProvider();
    await waitForForm();

    fireEvent.click(screen.getByRole('button', { name: /Match Atk style/i }));
    await screen.findByTestId('shoot-input');

    fireEvent.change(screen.getByTestId('shoot-input'), {
      target: { value: '150' },
    });

    expect(screen.getByTestId('shoot-input')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  test('has no accessibility violations in Match Atk mode', async () => {
    const { container } = renderWithProvider();
    await waitForForm();

    fireEvent.click(screen.getByRole('button', { name: /Match Atk style/i }));
    await screen.findByTestId('speed-input');

    expect(await axe(container)).toHaveNoViolations();
  });
});
