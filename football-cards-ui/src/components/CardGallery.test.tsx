import React from 'react';
import { render, screen, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CardGallery from './CardGallery';
import { CardProvider, CardState } from '../context/CardContext';
import { getSavedCards, deleteCard } from '../services/storage';

jest.mock('../services/storage');

const mockCards = [
  {
    playerName: 'Alice',
    club: 'Alpha FC',
    nationality: 'Aland',
    league: 'Alpha League',
    position: 'MID',
    preferredFoot: 'Right',
    defence: 40,
    control: 50,
    attack: 60,
    rating: 50,
    playerPhoto: null,
    cardBackground: null,
    cardId: 'card1',
  },
  {
    playerName: 'Bob',
    club: 'Beta FC',
    nationality: 'Betaland',
    league: 'Beta League',
    position: 'FWD',
    preferredFoot: 'Left',
    defence: 50,
    control: 60,
    attack: 70,
    rating: 60,
    playerPhoto: null,
    cardBackground: null,
    cardId: 'card2',
  },
];

describe('CardGallery Component', () => {
  beforeEach(() => {
    (getSavedCards as jest.Mock).mockReturnValue(mockCards);
    (deleteCard as jest.Mock).mockClear();
  });

  const renderGallery = (props: any = {}) =>
    render(
      <CardProvider>
        <CardGallery {...props} />
      </CardProvider>,
    );

  test('loads and displays saved cards from storage', async () => {
    renderGallery();

    // findByText waits for the async loadCards to complete and the spinner to disappear
    expect(await screen.findByText(/Your Card Gallery/i)).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  test('calls onEditCard callback when edit button clicked', async () => {
    const user = userEvent.setup();
    const onEditCard = jest.fn();
    renderGallery({ onEditCard });

    // Wait for cards to load before interacting
    await screen.findAllByRole('button', { name: /Edit/i });
    await user.click(screen.getAllByRole('button', { name: /Edit/i })[0]);

    expect(onEditCard).toHaveBeenCalled();
  });

  test('shows delete confirmation and deletes card', async () => {
    const user = userEvent.setup();
    renderGallery();

    // Wait for cards to load before interacting
    const deleteButtons = await screen.findAllByRole('button', {
      name: /Delete/i,
    });
    await user.click(deleteButtons[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/Delete Card/i)).toBeInTheDocument();

    const confirmDeleteButton = within(dialog).getByRole('button', {
      name: /Delete/i,
    });
    await user.click(confirmDeleteButton);

    expect(deleteCard).toHaveBeenCalledWith('card1');
  });

  test('shows empty state when no cards', async () => {
    (getSavedCards as jest.Mock).mockReturnValue([]);
    renderGallery();

    // findByText waits for the spinner to disappear and empty state to render
    expect(await screen.findByText(/No saved cards yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create New Card/i }),
    ).toBeInTheDocument();
  });

  test('invokes onCreateNew when create new is clicked', async () => {
    const user = userEvent.setup();
    (getSavedCards as jest.Mock).mockReturnValue([]);
    const onCreateNew = jest.fn();

    renderGallery({ onCreateNew });

    // Wait for the empty state (loading completes) before clicking
    await user.click(
      await screen.findByRole('button', { name: /Create New Card/i }),
    );
    expect(onCreateNew).toHaveBeenCalled();
  });
});

describe('CardGallery — List Semantics', () => {
  beforeEach(() => {
    (getSavedCards as jest.Mock).mockReturnValue(mockCards);
  });

  const renderGallery = (props: any = {}) =>
    render(
      <CardProvider>
        <CardGallery {...props} />
      </CardProvider>,
    );

  test('card grid has role="list" and each card has role="listitem"', async () => {
    renderGallery();
    expect(await screen.findByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  test('empty state renders as a heading', async () => {
    (getSavedCards as jest.Mock).mockReturnValue([]);
    renderGallery();
    expect(
      await screen.findByRole('heading', { name: /no saved cards/i }),
    ).toBeInTheDocument();
  });
});

describe('CardGallery — Focus Management', () => {
  const mockCard = {
    playerName: 'Alice',
    club: 'Alpha FC',
    nationality: 'Aland',
    league: 'Alpha League',
    position: 'MID',
    preferredFoot: 'Right',
    defence: 40,
    control: 50,
    attack: 60,
    rating: 50,
    playerPhoto: null,
    cardBackground: null,
    cardId: 'card1',
  };

  beforeEach(() => {
    (deleteCard as jest.Mock).mockClear();
  });

  const renderGallery = () =>
    render(
      <CardProvider>
        <CardGallery />
      </CardProvider>,
    );

  test('moves focus into the delete dialog when opened', async () => {
    const user = userEvent.setup();
    (getSavedCards as jest.Mock).mockReturnValue([mockCard]);
    renderGallery();

    // Wait for card to load before interacting
    await screen.findByTestId('delete-card');
    await user.click(screen.getByTestId('delete-card'));

    // MUI Dialog first moves focus to the dialog paper element (tabindex=-1)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toHaveFocus();
    });
  });

  test('returns focus to Create New button after confirming deletion', async () => {
    const user = userEvent.setup();
    (getSavedCards as jest.Mock)
      .mockReturnValueOnce([mockCard])
      .mockReturnValue([]);

    renderGallery();

    // Wait for card to load before interacting
    await screen.findByTestId('delete-card');
    await user.click(screen.getByTestId('delete-card'));

    const dialog = screen.getByRole('dialog');
    const confirmButton = within(dialog).getByRole('button', {
      name: /delete/i,
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /create new card/i }),
      ).toHaveFocus();
    });
  });
});

describe('CardGallery — Loading State', () => {
  const renderGallery = (
    props: Partial<Parameters<typeof CardGallery>[0]> = {},
  ) =>
    render(
      <CardProvider>
        <CardGallery {...props} />
      </CardProvider>,
    );

  test('shows loading spinner while cards are being fetched', async () => {
    let resolveCards!: (cards: CardState[]) => void;
    const pendingPromise = new Promise<CardState[]>((res) => {
      resolveCards = res;
    });
    (getSavedCards as jest.Mock).mockReturnValue(pendingPromise);

    renderGallery();

    // Spinner should be visible while the promise is pending
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText(/Your Card Gallery/i)).not.toBeInTheDocument();

    // Resolve the promise — spinner should disappear and cards should render
    await act(async () => {
      resolveCards(mockCards as CardState[]);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
