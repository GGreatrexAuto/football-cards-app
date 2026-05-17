import {
  saveCard,
  getSavedCards,
  updateCard,
  deleteCard,
  generateCardId,
} from './storage';
import { CardState, DEFAULT_TEXT_FONTS } from '../context/CardContext';

const card: CardState = {
  playerName: 'Test Player',
  club: 'Test Club',
  nationality: 'Testland',
  league: 'Test League',
  position: 'MID',
  preferredFoot: 'Right',
  defence: 40,
  control: 40,
  attack: 40,
  rating: 40,
  playerPhoto: null,
  cardBackground: null,
  cardId: null,
  textFonts: {
    playerName: 'Poppins',
    clubText: 'Inter',
    countryText: 'Bitter',
    statsText: 'Montserrat',
  },
};

describe('Storage service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('generateCardId returns unique string', () => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date(1000));
    const id1 = generateCardId();

    jest.setSystemTime(new Date(1001));
    const id2 = generateCardId();

    expect(id1).toBe('card_1000');
    expect(id2).toBe('card_1001');
    expect(id1).not.toEqual(id2);

    jest.useRealTimers();
  });

  test('saveCard stores card in localStorage', () => {
    saveCard(card);
    const stored = getSavedCards();

    expect(stored.length).toBe(1);
    expect(stored[0].playerName).toBe('Test Player');
    expect(stored[0].cardId).toMatch(/card_/);
  });

  test('getSavedCards returns empty array when no data', () => {
    expect(getSavedCards()).toEqual([]);
  });

  test('updateCard updates existing card', () => {
    saveCard(card);
    const stored = getSavedCards();
    const cardId = stored[0].cardId as string;

    updateCard(cardId, { ...stored[0], playerName: 'Updated Player' });

    const updated = getSavedCards();
    expect(updated[0].playerName).toBe('Updated Player');
  });

  test('deleteCard removes card from storage', () => {
    saveCard(card);
    const stored = getSavedCards();
    const cardId = stored[0].cardId as string;

    deleteCard(cardId);
    expect(getSavedCards()).toEqual([]);
  });

  test('saveCard and getSavedCards preserve textFonts', () => {
    saveCard(card);
    const stored = getSavedCards();

    expect(stored[0].textFonts).toEqual({
      playerName: 'Poppins',
      clubText: 'Inter',
      countryText: 'Bitter',
      statsText: 'Montserrat',
    });
  });

  test('getSavedCards fills in default textFonts for legacy cards missing the field', () => {
    const legacyCard = {
      playerName: 'Legacy Player',
      club: 'Old Club',
      nationality: 'Oldland',
      league: 'Old League',
      position: 'GK',
      preferredFoot: 'Left',
      defence: 70,
      control: 60,
      attack: 50,
      rating: 60,
      playerPhoto: null,
      cardBackground: null,
      cardId: 'card_legacy_1',
      // no textFonts — simulates a card saved before this field existed
    };
    localStorage.setItem('football-cards', JSON.stringify([legacyCard]));

    const stored = getSavedCards();

    expect(stored[0].textFonts).toEqual(DEFAULT_TEXT_FONTS);
  });
});
