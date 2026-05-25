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

    expect(await screen.findByLabelText('Player Name')).toBeInTheDocument();
  });

  test('populates dropdowns from API and updates player name field', async () => {
    renderWithProvider();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const nameInput = (await screen.findByLabelText(
      'Player Name',
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

    await screen.findByTestId('defence-input');

    const attack = screen.getByTestId('attack-input') as HTMLInputElement;
    const control = screen.getByTestId('control-input') as HTMLInputElement;
    const defence = screen.getByTestId('defence-input') as HTMLInputElement;

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
      'Player Name',
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
      'Player Name',
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
    expect(getPositions).toHaveBeenCalled();

    // Verify form elements are in the document (selects, inputs, buttons)
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(3);
    expect(
      screen.getByRole('button', { name: /randomize stats/i }),
    ).toBeInTheDocument();
  });

  test('selects background option when clicked', async () => {
    renderWithPreview();

    // Wait for form to load
    await screen.findByLabelText('Player Name');

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

    await screen.findByLabelText('Player Name');

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

  test('clubs dropdown displays options in alphabetical order', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const clubSelect = screen.getByTestId('club-select');
    const combobox = within(clubSelect).getByRole('combobox');
    fireEvent.mouseDown(combobox);

    const options = await screen.findAllByRole('option');
    const clubOptionTexts = options
      .map((o) => o.textContent ?? '')
      .filter((t) => mockedClubs.some((c) => c.name === t));

    expect(clubOptionTexts).toEqual(['Arsenal FC', 'FC Test', 'Unit United']);
  });

  test('selecting "Other" option reveals custom club name input', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.queryByTestId('custom-club-input')).not.toBeInTheDocument();

    const clubSelect = screen.getByTestId('club-select');
    const combobox = within(clubSelect).getByRole('combobox');
    fireEvent.mouseDown(combobox);

    const otherOption = await screen.findByRole('option', {
      name: /Other.*enter club name/i,
    });
    fireEvent.click(otherOption);

    expect(await screen.findByTestId('custom-club-input')).toBeInTheDocument();
  });

  test('typing in custom club input updates the card club', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const clubSelect = screen.getByTestId('club-select');
    const combobox = within(clubSelect).getByRole('combobox');
    fireEvent.mouseDown(combobox);

    const otherOption = await screen.findByRole('option', {
      name: /Other.*enter club name/i,
    });
    fireEvent.click(otherOption);

    const customInput = (await screen.findByTestId(
      'custom-club-input',
    )) as HTMLInputElement;
    fireEvent.change(customInput, { target: { value: 'Mytown United' } });

    expect(customInput.value).toBe('Mytown United');
  });

  test('custom club input is hidden when a real club is re-selected', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Switch to custom
    const clubSelect = screen.getByTestId('club-select');
    const combobox = within(clubSelect).getByRole('combobox');
    fireEvent.mouseDown(combobox);
    const otherOption = await screen.findByRole('option', {
      name: /Other.*enter club name/i,
    });
    fireEvent.click(otherOption);
    expect(await screen.findByTestId('custom-club-input')).toBeInTheDocument();

    // Switch back to a real club
    fireEvent.mouseDown(combobox);
    const arsenalOption = await screen.findByRole('option', {
      name: 'Arsenal FC',
    });
    fireEvent.click(arsenalOption);

    await waitFor(() => {
      expect(screen.queryByTestId('custom-club-input')).not.toBeInTheDocument();
    });
  });

  test('filters clubs when a league is selected', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Select Test League (id: 1) — only Unit United and FC Test belong to it
    const leagueSelect = screen.getByTestId('league-select');
    fireEvent.mouseDown(within(leagueSelect).getByRole('combobox'));
    fireEvent.click(await screen.findByRole('option', { name: 'Test League' }));

    // Open club dropdown and inspect available options
    const clubSelect = screen.getByTestId('club-select');
    fireEvent.mouseDown(within(clubSelect).getByRole('combobox'));

    const options = await screen.findAllByRole('option');
    const clubNames = options.map((o) => o.textContent ?? '');
    expect(clubNames).toContain('Unit United');
    expect(clubNames).toContain('FC Test');
    expect(clubNames).not.toContain('Arsenal FC');
  });

  test('auto-populates league when a known club is selected', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Select Arsenal FC (league_id: 2 → Mock League)
    const clubSelect = screen.getByTestId('club-select');
    fireEvent.mouseDown(within(clubSelect).getByRole('combobox'));
    fireEvent.click(await screen.findByRole('option', { name: 'Arsenal FC' }));

    // League should now show Mock League
    const leagueCombobox = within(
      screen.getByTestId('league-select'),
    ).getByRole('combobox');
    expect(leagueCombobox).toHaveTextContent('Mock League');
  });

  test('clears club selection when league is changed to an incompatible one', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Select Arsenal FC — auto-populates Mock League
    const clubSelect = screen.getByTestId('club-select');
    fireEvent.mouseDown(within(clubSelect).getByRole('combobox'));
    fireEvent.click(await screen.findByRole('option', { name: 'Arsenal FC' }));

    // Change league to Test League (id: 1) — Arsenal is league_id 2, so it must be cleared
    const leagueSelect = screen.getByTestId('league-select');
    fireEvent.mouseDown(within(leagueSelect).getByRole('combobox'));
    fireEvent.click(await screen.findByRole('option', { name: 'Test League' }));

    // Club combobox should no longer show Arsenal FC
    await waitFor(() => {
      expect(
        within(screen.getByTestId('club-select')).getByRole('combobox'),
      ).not.toHaveTextContent('Arsenal FC');
    });
  });

  test('does not show custom league option when no custom club is active', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Open league dropdown with no custom club selected
    const leagueSelect = screen.getByTestId('league-select');
    fireEvent.mouseDown(within(leagueSelect).getByRole('combobox'));

    // Custom league sentinel should NOT appear
    expect(
      screen.queryByRole('option', { name: /Other.*enter league name/i }),
    ).not.toBeInTheDocument();
  });

  test('shows custom league option when custom club is active', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Select custom club first
    const clubSelect = screen.getByTestId('club-select');
    fireEvent.mouseDown(within(clubSelect).getByRole('combobox'));
    fireEvent.click(
      await screen.findByRole('option', { name: /Other.*enter club name/i }),
    );

    // Open league dropdown — custom league sentinel must now be visible
    const leagueSelect = screen.getByTestId('league-select');
    fireEvent.mouseDown(within(leagueSelect).getByRole('combobox'));
    expect(
      await screen.findByRole('option', { name: /Other.*enter league name/i }),
    ).toBeInTheDocument();
  });

  test('custom league text input updates the card league', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Select custom club
    const clubSelect = screen.getByTestId('club-select');
    fireEvent.mouseDown(within(clubSelect).getByRole('combobox'));
    fireEvent.click(
      await screen.findByRole('option', { name: /Other.*enter club name/i }),
    );

    // Select custom league
    const leagueSelect = screen.getByTestId('league-select');
    fireEvent.mouseDown(within(leagueSelect).getByRole('combobox'));
    fireEvent.click(
      await screen.findByRole('option', { name: /Other.*enter league name/i }),
    );

    // Custom league text input should appear; type a name
    const customLeagueInput = (await screen.findByTestId(
      'custom-league-input',
    )) as HTMLInputElement;
    fireEvent.change(customLeagueInput, { target: { value: 'Sunday League' } });
    expect(customLeagueInput.value).toBe('Sunday League');
  });

  test('reset form clears custom league state', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Activate custom club + custom league
    const clubSelect = screen.getByTestId('club-select');
    fireEvent.mouseDown(within(clubSelect).getByRole('combobox'));
    fireEvent.click(
      await screen.findByRole('option', { name: /Other.*enter club name/i }),
    );
    const leagueSelect = screen.getByTestId('league-select');
    fireEvent.mouseDown(within(leagueSelect).getByRole('combobox'));
    fireEvent.click(
      await screen.findByRole('option', { name: /Other.*enter league name/i }),
    );
    expect(
      await screen.findByTestId('custom-league-input'),
    ).toBeInTheDocument();

    // Click Reset
    fireEvent.click(screen.getByRole('button', { name: /Reset Form/i }));

    await waitFor(() => {
      expect(
        screen.queryByTestId('custom-league-input'),
      ).not.toBeInTheDocument();
    });
  });

  test('displays semi-transparent gradient overlay with background', async () => {
    renderWithPreview();

    await screen.findByLabelText('Player Name');

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

    const buttons = screen.getAllByRole('button', { name: /Player Portrait/i });
    expect(buttons).toHaveLength(6);
  });

  test('clicking a stock photo sets aria-pressed to true', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const first = screen.getByRole('button', { name: 'Player Portrait 1' });
    expect(first).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-pressed', 'true');
  });

  test('pressing Enter on a stock photo selects it', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const second = screen.getByRole('button', { name: 'Player Portrait 2' });
    fireEvent.keyDown(second, { key: 'Enter', code: 'Enter' });
    expect(second).toHaveAttribute('aria-pressed', 'true');
  });

  test('pressing Space on a stock photo selects it', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const third = screen.getByRole('button', { name: 'Player Portrait 3' });
    fireEvent.keyDown(third, { key: ' ', code: 'Space' });
    expect(third).toHaveAttribute('aria-pressed', 'true');
  });

  test('selecting a second portrait deselects the first', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const first = screen.getByRole('button', { name: 'Player Portrait 1' });
    const second = screen.getByRole('button', { name: 'Player Portrait 2' });

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(second);
    expect(first).toHaveAttribute('aria-pressed', 'false');
    expect(second).toHaveAttribute('aria-pressed', 'true');
  });

  test('stock photo cards are focusable via tabIndex', async () => {
    renderWithProvider();
    await screen.findByLabelText('Player Name');

    const button = screen.getByRole('button', { name: 'Player Portrait 1' });
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

    // Click reset — should remain at defaults (confirms button works without error)
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

    fireEvent.click(screen.getByAltText('Stadium Blue'));

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

    fireEvent.click(screen.getByAltText('Stadium Blue'));
    await waitFor(() => {
      expect(screen.getByTestId('reset-card-background')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByTestId('reset-fields'));

    await waitFor(() => {
      expect(screen.getByTestId('reset-card-background')).not.toBeDisabled();
    });
  });
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
