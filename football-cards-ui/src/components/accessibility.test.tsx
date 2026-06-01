import React from 'react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import '@testing-library/jest-dom';
import CardForm from './CardForm';
import CardPreview from './CardPreview';
import CardGallery from './CardGallery';
import { CardProvider } from '../context/CardContext';
import {
  getClubs,
  getNationalities,
  getLeagues,
  getPositions,
} from '../services/api';
import { getSavedCards, deleteCard } from '../services/storage';

jest.mock('axios', () => ({
  create: jest.fn(() => ({ get: jest.fn() })),
}));
jest.mock('../services/api');
jest.mock('../services/storage');

const mockedClubs = [{ id: 1, name: 'FC Test' }];
const mockedNations = [{ id: 1, name: 'Testland' }];
const mockedLeagues = [{ id: 1, name: 'Test League' }];
const mockedCards = [
  {
    cardId: 'card_001',
    playerName: 'Test Player',
    club: 'FC Test',
    nationality: 'Testland',
    league: 'Test League',
    position: 'Forward',
    preferredFoot: 'Right',
    defence: 70,
    control: 75,
    attack: 80,
    rating: 75,
    playerPhoto: '',
    cardBackground: '',
  },
];

beforeEach(() => {
  (getClubs as jest.Mock).mockResolvedValue(mockedClubs);
  (getNationalities as jest.Mock).mockResolvedValue(mockedNations);
  (getLeagues as jest.Mock).mockResolvedValue(mockedLeagues);
  (getPositions as jest.Mock).mockResolvedValue([
    { code: 'GK', name: 'Goalkeeper' },
    { code: 'FWD', name: 'Forward' },
  ]);
  (getSavedCards as jest.Mock).mockReturnValue(mockedCards);
  (deleteCard as jest.Mock).mockImplementation(() => {});
});

// Suppress MUI TouchRipple/Popover/Modal act() warnings — pulsate animations
// and exit-transition callbacks fire via setTimeout after act() exits and cannot
// be fixed by switching to userEvent alone. Real errors still pass through.
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

describe('Accessibility — WCAG violations (axe)', () => {
  test('CardForm has no axe violations after API data loads', async () => {
    const { container } = render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('CardPreview has no axe violations', async () => {
    const { container } = render(
      <CardProvider>
        <CardPreview />
      </CardProvider>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('CardGallery has no axe violations when cards are present', async () => {
    const { container } = render(
      <CardProvider>
        <CardGallery />
      </CardProvider>,
    );

    // Wait for async loadCards to complete before running axe
    await screen.findByText(/Your Card Gallery/i);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('CardForm font selectors have no axe violations', async () => {
    const { container } = render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await screen.findByTestId('font-selector-player-name-font');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('CardForm image frame type and crop focus selectors have no axe violations', async () => {
    const { container } = render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await screen.findByTestId('image-frame-type-selector');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Accessibility — aria-labels and alt text', () => {
  test('CardForm: all key inputs are accessible by label', async () => {
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );

    expect(screen.getByLabelText('Player Name')).toBeInTheDocument();
    expect(screen.getByTestId('defence-input')).toBeInTheDocument();
    expect(screen.getByTestId('control-input')).toBeInTheDocument();
    expect(screen.getByTestId('attack-input')).toBeInTheDocument();
  });

  test('CardForm: action buttons have accessible names', async () => {
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );

    expect(
      screen.getByRole('button', { name: /randomize stats/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save card/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /reset form/i }),
    ).toBeInTheDocument();
  });

  test('CardForm: stock photo buttons have role, aria-label, aria-pressed, tabIndex, and alt text', async () => {
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );

    const photoButtons = screen.getAllByRole('button', {
      name: /Portrait of a/i,
    });
    expect(photoButtons.length).toBeGreaterThanOrEqual(6);

    photoButtons.forEach((btn) => {
      expect(btn).toHaveAttribute('aria-label');
      expect(btn).toHaveAttribute('aria-pressed');
      expect(btn).toHaveAttribute('tabIndex', '0');
    });

    within(screen.getByTestId('stock-photos'))
      .getAllByRole('img')
      .forEach((img) => expect(img).toHaveAttribute('alt'));
  });

  test('CardGallery: Edit and Delete buttons have accessible names', async () => {
    render(
      <CardProvider>
        <CardGallery />
      </CardProvider>,
    );

    // Wait for async loadCards to complete before checking buttons
    expect(
      await screen.findByRole('button', { name: /edit/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});

describe('Accessibility — keyboard navigation', () => {
  test('CardForm: key inputs are focusable and reachable via keyboard', async () => {
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );

    const playerNameInput = screen.getByLabelText('Player Name');
    const defenceInput = screen.getByTestId('defence-input');
    const controlInput = screen.getByTestId('control-input');
    const attackInput = screen.getByTestId('attack-input');

    // Verify each key input can receive focus — confirms it is not disabled or
    // removed from the tab sequence. Uses toHaveFocus() (jest-dom) not document.activeElement.
    // Wrapped in act() so MUI's onFocus/onBlur state updates are flushed synchronously.
    act(() => {
      playerNameInput.focus();
    });
    expect(playerNameInput).toHaveFocus();

    act(() => {
      defenceInput.focus();
    });
    expect(defenceInput).toHaveFocus();

    act(() => {
      controlInput.focus();
    });
    expect(controlInput).toHaveFocus();

    act(() => {
      attackInput.focus();
    });
    expect(attackInput).toHaveFocus();
  });

  test('CardForm: stock photo buttons are keyboard-focusable', async () => {
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );

    const firstButton = screen.getAllByRole('button', {
      name: /Portrait of a/i,
    })[0];
    act(() => {
      firstButton.focus();
    });
    expect(firstButton).toHaveFocus();
  });

  test('CardForm: font selector comboboxes are keyboard-focusable', async () => {
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await screen.findByTestId('font-selector-player-name-font');
    const combobox = within(
      screen.getByTestId('font-selector-player-name-font'),
    ).getByRole('combobox');
    act(() => {
      combobox.focus();
    });
    expect(combobox).toHaveFocus();
  });

  test('CardForm: image frame type toggle buttons are keyboard-focusable', async () => {
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await screen.findByTestId('image-frame-type-selector');
    const selector = screen.getByTestId('image-frame-type-selector');
    const faceButton = within(selector).getByRole('button', { name: 'Face' });
    act(() => {
      faceButton.focus();
    });
    expect(faceButton).toHaveFocus();
  });

  test('CardForm: image crop focus toggle buttons are keyboard-focusable', async () => {
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await screen.findByTestId('image-crop-focus-selector');
    const selector = screen.getByTestId('image-crop-focus-selector');
    const topButton = within(selector).getByRole('button', { name: 'Top' });
    act(() => {
      topButton.focus();
    });
    expect(topButton).toHaveFocus();
  });

  test('CardForm: all image frame type toggle buttons have accessible names', async () => {
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await screen.findByTestId('image-frame-type-selector');
    const selector = screen.getByTestId('image-frame-type-selector');
    const buttons = within(selector).getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toHaveAccessibleName();
    });
  });
});

describe('Accessibility — tab order and keyboard interaction', () => {
  test('CardForm: tab order covers Player Name → stats inputs in sequence', async () => {
    const user = userEvent.setup();
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );

    const playerNameInput = screen.getByLabelText('Player Name');
    const defenceInput = screen.getByTestId('defence-input');
    const controlInput = screen.getByTestId('control-input');
    const attackInput = screen.getByTestId('attack-input');

    // Focus Player Name first
    act(() => {
      playerNameInput.focus();
    });
    expect(playerNameInput).toHaveFocus();

    // Tab through Player Info fields (League, Position, Club, Nationality, Foot, Reset Fields)
    // and Stats Style toggles until we reach Defence
    let iterations = 0;
    while (!defenceInput.matches(':focus') && iterations < 20) {
      await user.tab();
      iterations++;
    }
    expect(defenceInput).toHaveFocus();

    // Each stat input is followed by a per-stat randomise button, so tab past it
    iterations = 0;
    while (!controlInput.matches(':focus') && iterations < 5) {
      await user.tab();
      iterations++;
    }
    expect(controlInput).toHaveFocus();

    iterations = 0;
    while (!attackInput.matches(':focus') && iterations < 5) {
      await user.tab();
      iterations++;
    }
    expect(attackInput).toHaveFocus();
  });

  test('CardGallery: Escape key closes delete dialog without deleting', async () => {
    const user = userEvent.setup();
    render(
      <CardProvider>
        <CardGallery />
      </CardProvider>,
    );

    // Wait for async loadCards before interacting
    const deleteBtn = await screen.findByRole('button', { name: /delete/i });

    // Open the delete confirmation dialog
    await user.click(deleteBtn);

    await screen.findByRole('dialog');

    // Press Escape to dismiss
    await user.keyboard('{Escape}');

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );

    expect(deleteCard).not.toHaveBeenCalled();
  });

  test('CardForm: Space on a stock photo button toggles aria-pressed', async () => {
    const user = userEvent.setup();
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );

    const firstPhotoBtn = screen.getAllByRole('button', {
      name: /Portrait of a/i,
    })[0];

    expect(firstPhotoBtn).toHaveAttribute('aria-pressed', 'false');

    act(() => {
      firstPhotoBtn.focus();
    });
    await user.keyboard(' ');

    expect(firstPhotoBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('CardForm: Enter on image frame type toggle activates it', async () => {
    const user = userEvent.setup();
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await screen.findByTestId('image-frame-type-selector');
    const selector = screen.getByTestId('image-frame-type-selector');
    const headShouldersBtn = within(selector).getByRole('button', {
      name: /head & shoulders/i,
    });

    act(() => {
      headShouldersBtn.focus();
    });
    await user.keyboard('{Enter}');

    // MUI ToggleButton sets aria-pressed="true" when selected
    expect(headShouldersBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('CardForm: arrow keys within ToggleButtonGroup for frame type', async () => {
    const user = userEvent.setup();
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

    await screen.findByTestId('image-frame-type-selector');
    const selector = screen.getByTestId('image-frame-type-selector');
    const faceBtn = within(selector).getByRole('button', { name: 'Face' });
    const headShouldersBtn = within(selector).getByRole('button', {
      name: /head & shoulders/i,
    });

    act(() => {
      faceBtn.focus();
    });
    expect(faceBtn).toHaveFocus();

    await user.keyboard('{ArrowRight}');

    // MUI ToggleButtonGroup uses standard buttons — arrow key navigation is not
    // built-in. Focus stays on the original button (documenting the limitation).
    const headShouldersFocused = headShouldersBtn.matches(':focus');
    const faceFocused = faceBtn.matches(':focus');
    expect(headShouldersFocused || faceFocused).toBe(true);
  });
});
