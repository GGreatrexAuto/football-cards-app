import React from 'react';
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import CardGallery from './CardGallery';
import { CardProvider } from '../context/CardContext';
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

  test('loads and displays saved cards from storage', () => {
    renderGallery();

    expect(screen.getByText(/Your Card Gallery/i)).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  test('calls onEditCard callback when edit button clicked', () => {
    const onEditCard = jest.fn();
    renderGallery({ onEditCard });

    fireEvent.click(screen.getAllByRole('button', { name: /Edit/i })[0]);

    expect(onEditCard).toHaveBeenCalled();
  });

  test('shows delete confirmation and deletes card', () => {
    renderGallery();

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/Delete Card/i)).toBeInTheDocument();

    const confirmDeleteButton = within(dialog).getByRole('button', {
      name: /Delete/i,
    });
    fireEvent.click(confirmDeleteButton);

    expect(deleteCard).toHaveBeenCalledWith('card1');
  });

  test('shows empty state when no cards', () => {
    (getSavedCards as jest.Mock).mockReturnValue([]);
    renderGallery();

    expect(screen.getByText(/No saved cards yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create New Card/i }),
    ).toBeInTheDocument();
  });

  test('invokes onCreateNew when create new is clicked', () => {
    (getSavedCards as jest.Mock).mockReturnValue([]);
    const onCreateNew = jest.fn();

    renderGallery({ onCreateNew });

    fireEvent.click(screen.getByRole('button', { name: /Create New Card/i }));
    expect(onCreateNew).toHaveBeenCalled();
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
    (getSavedCards as jest.Mock).mockReturnValue([mockCard]);
    renderGallery();

    fireEvent.click(screen.getByTestId('delete-card'));

    // MUI Dialog first moves focus to the dialog paper element (tabindex=-1)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toHaveFocus();
    });
  });

  test('returns focus to Create New button after confirming deletion', async () => {
    (getSavedCards as jest.Mock)
      .mockReturnValueOnce([mockCard])
      .mockReturnValue([]);

    renderGallery();

    fireEvent.click(screen.getByTestId('delete-card'));

    const dialog = screen.getByRole('dialog');
    const confirmButton = within(dialog).getByRole('button', {
      name: /delete/i,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /create new card/i }),
      ).toHaveFocus();
    });
  });
});
