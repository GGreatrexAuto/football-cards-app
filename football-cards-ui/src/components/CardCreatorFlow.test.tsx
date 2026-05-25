import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '../App';
import {
  getClubs,
  getNationalities,
  getLeagues,
  getPositions,
} from '../services/api';

jest.setTimeout(20000);

jest.mock('../services/api');

const mockedClubs = [
  { id: 1, name: 'FC Test', league_id: 1, league_name: 'Test League' },
  { id: 2, name: 'Unit United', league_id: 2, league_name: 'Mock League' },
];
const mockedNations = [
  { id: 1, name: 'Testland' },
  { id: 2, name: 'Mockistan' },
];
const mockedLeagues = [
  { id: 1, name: 'Test League' },
  { id: 2, name: 'Mock League' },
];

const openSelectAndChoose = async (index: number, optionText: string) => {
  const selectElements = await screen.findAllByRole('combobox');
  const select = selectElements[index];
  fireEvent.mouseDown(select);
  const option = await screen.findByText(optionText);
  fireEvent.click(option);
};

describe('CardCreator integration flow', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
    (getClubs as jest.Mock).mockResolvedValue(mockedClubs);
    (getNationalities as jest.Mock).mockResolvedValue(mockedNations);
    (getLeagues as jest.Mock).mockResolvedValue(mockedLeagues);
    (getPositions as jest.Mock).mockResolvedValue([
      { code: 'GK', name: 'Goalkeeper' },
      { code: 'DEF', name: 'Defender' },
      { code: 'MID', name: 'Midfielder' },
      { code: 'FWD', name: 'Forward' },
    ]);
  });

  test('fills out form, updates background/photo, saves card, and displays it in gallery', async () => {
    render(<App />);

    await screen.findByLabelText('Player Name');

    userEvent.type(screen.getByLabelText('Player Name'), 'Champion Player');

    await openSelectAndChoose(0, 'FC Test');
    await openSelectAndChoose(1, 'Testland');
    // league is auto-populated when a known club is selected
    await waitFor(() =>
      expect(screen.getByTestId('league-select')).toHaveTextContent(
        'Test League',
      ),
    );
    await openSelectAndChoose(3, 'Forward');
    await openSelectAndChoose(4, 'Left');

    fireEvent.click(screen.getByAltText('Player Portrait 1'));
    fireEvent.click(screen.getByAltText('Stadium Blue'));

    const previewCard = await screen.findByTestId('card-preview');
    expect(previewCard.dataset.backgroundImage).toContain(
      'picsum.photos/300/200?random=2',
    );

    fireEvent.click(screen.getByRole('button', { name: /Save Card/i }));
    expect(
      await screen.findByText(/Card saved successfully/i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Load from Gallery/i }));

    expect(await screen.findByText(/Your Card Gallery/i)).toBeInTheDocument();
    expect(screen.getByText('Champion Player')).toBeInTheDocument();
    expect(screen.getByText(/FC Test/)).toBeInTheDocument();
    expect(screen.getByText(/FWD/)).toBeInTheDocument();
  });

  test('edits saved card and loads it back into the form', async () => {
    localStorage.setItem(
      'football-cards',
      JSON.stringify([
        {
          playerName: 'Saved Hero',
          club: 'FC Test',
          nationality: 'Testland',
          league: 'Test League',
          position: 'FWD',
          preferredFoot: 'Right',
          defence: 80,
          control: 70,
          attack: 90,
          rating: 80,
          playerPhoto: 'https://picsum.photos/100/100?random=4',
          cardBackground: 'https://picsum.photos/300/200?random=2',
          cardId: 'card_saved_1',
        },
      ]),
    );

    render(<App />);

    const myCardsTab = screen.getByRole('tab', { name: /My Cards/i });
    userEvent.click(myCardsTab);

    expect(await screen.findByText(/Saved Hero/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

    expect(await screen.findByLabelText('Player Name')).toHaveValue(
      'Saved Hero',
    );
  });

  test('deletes a saved card from the gallery', async () => {
    localStorage.setItem(
      'football-cards',
      JSON.stringify([
        {
          playerName: 'Removable Star',
          club: 'FC Test',
          nationality: 'Testland',
          league: 'Test League',
          position: 'FWD',
          preferredFoot: 'Right',
          defence: 80,
          control: 70,
          attack: 90,
          rating: 80,
          playerPhoto: null,
          cardBackground: null,
          cardId: 'card_remove_1',
        },
      ]),
    );

    render(<App />);

    const myCardsTab = screen.getByRole('tab', { name: /My Cards/i });
    userEvent.click(myCardsTab);

    expect(await screen.findByText(/Removable Star/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(screen.getByText(/No saved cards yet/i)).toBeInTheDocument();
    });
  });

  test('renders card preview column with data-testid for sticky layout', async () => {
    render(<App />);
    await screen.findByRole('textbox', { name: /player name/i });
    expect(screen.getByTestId('card-preview-column')).toBeInTheDocument();
  });
});

describe('Font persistence', () => {
  const baseCardFields = {
    club: 'FC Test',
    nationality: 'Testland',
    league: 'Test League',
    position: 'FWD',
    preferredFoot: 'Right',
    defence: 80,
    control: 70,
    attack: 90,
    rating: 80,
    playerPhoto: null,
    cardBackground: null,
  };

  beforeEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
    (getClubs as jest.Mock).mockResolvedValue(mockedClubs);
    (getNationalities as jest.Mock).mockResolvedValue(mockedNations);
    (getLeagues as jest.Mock).mockResolvedValue(mockedLeagues);
    (getPositions as jest.Mock).mockResolvedValue([
      { code: 'GK', name: 'Goalkeeper' },
      { code: 'DEF', name: 'Defender' },
      { code: 'MID', name: 'Midfielder' },
      { code: 'FWD', name: 'Forward' },
    ]);
  });

  test('loading a saved card with custom fonts shows those fonts in the selectors', async () => {
    localStorage.setItem(
      'football-cards',
      JSON.stringify([
        {
          ...baseCardFields,
          playerName: 'Font Hero',
          cardId: 'card_font_1',
          textFonts: {
            playerName: 'Poppins',
            clubText: 'Montserrat',
            countryText: 'Bitter',
            statsText: 'Inter',
          },
        },
      ]),
    );

    render(<App />);

    const myCardsTab = screen.getByRole('tab', { name: /My Cards/i });
    userEvent.click(myCardsTab);

    expect(await screen.findByText(/Font Hero/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

    await screen.findByLabelText('Player Name');
    await waitFor(() => {
      expect(
        within(screen.getByTestId('font-selector-player-name-font')).getByRole(
          'combobox',
        ),
      ).toHaveTextContent('Poppins');
    });
  });

  test("switching between saved cards shows each card's fonts", async () => {
    localStorage.setItem(
      'football-cards',
      JSON.stringify([
        {
          ...baseCardFields,
          playerName: 'Card Alpha',
          cardId: 'card_font_alpha',
          textFonts: {
            playerName: 'Bebas Neue',
            clubText: 'Roboto',
            countryText: 'Roboto',
            statsText: 'Roboto',
          },
        },
        {
          ...baseCardFields,
          playerName: 'Card Beta',
          cardId: 'card_font_beta',
          textFonts: {
            playerName: 'Merriweather',
            clubText: 'Roboto',
            countryText: 'Roboto',
            statsText: 'Roboto',
          },
        },
      ]),
    );

    render(<App />);
    const myCardsTab = screen.getByRole('tab', { name: /My Cards/i });
    userEvent.click(myCardsTab);

    // Edit first card and verify its font
    const editButtons = await screen.findAllByRole('button', { name: /Edit/i });
    fireEvent.click(editButtons[0]);
    await screen.findByLabelText('Player Name');
    await waitFor(() => {
      expect(
        within(screen.getByTestId('font-selector-player-name-font')).getByRole(
          'combobox',
        ),
      ).toHaveTextContent('Bebas Neue');
    });

    // Return to gallery and edit second card
    userEvent.click(screen.getByRole('tab', { name: /My Cards/i }));
    const editButtons2 = await screen.findAllByRole('button', {
      name: /Edit/i,
    });
    fireEvent.click(editButtons2[1]);
    await screen.findByLabelText('Player Name');
    await waitFor(() => {
      expect(
        within(screen.getByTestId('font-selector-player-name-font')).getByRole(
          'combobox',
        ),
      ).toHaveTextContent('Merriweather');
    });
  });
});
