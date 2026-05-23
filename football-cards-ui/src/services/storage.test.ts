import {
  saveCard,
  getSavedCards,
  updateCard,
  deleteCard,
  generateCardId,
} from './storage';
import {
  CardState,
  DEFAULT_TEXT_FONTS,
  DEFAULT_IMAGE_FRAME_TYPE,
  DEFAULT_IMAGE_CROP_FOCUS,
  DEFAULT_CARD_BORDER_SHAPE,
  DEFAULT_CARD_BORDER_COLOR,
} from '../context/CardContext';

const card: CardState = {
  playerName: 'Test Player',
  club: 'Test Club',
  nationality: 'Testland',
  nationalityCode: '',
  nationalityDisplay: 'text',
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
  imageFrameType: 'headAndShoulders',
  imageCropFocus: 'bottom',
  cardBorderShape: 'shield',
  cardBorderColor: '#ff0000',
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

  test('saveCard and getSavedCards preserve imageFrameType and imageCropFocus', () => {
    saveCard(card);
    const stored = getSavedCards();

    expect(stored[0].imageFrameType).toBe('headAndShoulders');
    expect(stored[0].imageCropFocus).toBe('bottom');
  });

  test('saveCard and getSavedCards preserve cardBorderShape and cardBorderColor', () => {
    saveCard(card);
    const stored = getSavedCards();

    expect(stored[0].cardBorderShape).toBe('shield');
    expect(stored[0].cardBorderColor).toBe('#ff0000');
  });

  test('getSavedCards fills in default cardBorderShape and cardBorderColor for legacy cards missing those fields', () => {
    const legacyCard = {
      playerName: 'Old Player',
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
      cardId: 'card_legacy_3',
      textFonts: { ...DEFAULT_TEXT_FONTS },
      imageFrameType: DEFAULT_IMAGE_FRAME_TYPE,
      imageCropFocus: DEFAULT_IMAGE_CROP_FOCUS,
      // no cardBorderShape or cardBorderColor
    };
    localStorage.setItem('football-cards', JSON.stringify([legacyCard]));

    const stored = getSavedCards();

    expect(stored[0].cardBorderShape).toBe(DEFAULT_CARD_BORDER_SHAPE);
    expect(stored[0].cardBorderColor).toBe(DEFAULT_CARD_BORDER_COLOR);
  });

  test('getSavedCards fills in default imageFrameType and imageCropFocus for legacy cards missing those fields', () => {
    const legacyCard = {
      playerName: 'Old Player',
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
      cardId: 'card_legacy_2',
      textFonts: { ...DEFAULT_TEXT_FONTS },
      // no imageFrameType or imageCropFocus
    };
    localStorage.setItem('football-cards', JSON.stringify([legacyCard]));

    const stored = getSavedCards();

    expect(stored[0].imageFrameType).toBe(DEFAULT_IMAGE_FRAME_TYPE);
    expect(stored[0].imageCropFocus).toBe(DEFAULT_IMAGE_CROP_FOCUS);
  });
});
