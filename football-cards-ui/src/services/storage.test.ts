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
  DEFAULT_STATS_STYLE,
  DEFAULT_CARD_LAYOUT,
  DEFAULT_TEXT_COLORS,
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
  statsStyle: 'adrenaline',
  speed: 60,
  tackle: 65,
  power: 70,
  shoot: 75,
  skill: 55,
  pass: 50,
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
  cardType: 'club',
  cardLayout: DEFAULT_CARD_LAYOUT,
  textColors: { ...DEFAULT_TEXT_COLORS },
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

  test('saveCard and getSavedCards preserve statsStyle and Match Atk stats', () => {
    const matchAtkCard: CardState = {
      ...card,
      statsStyle: 'matchAtk',
      speed: 80,
      tackle: 75,
      power: 85,
      shoot: 90,
      skill: 70,
      pass: 65,
    };
    saveCard(matchAtkCard);
    const stored = getSavedCards();

    expect(stored[0].statsStyle).toBe('matchAtk');
    expect(stored[0].speed).toBe(80);
    expect(stored[0].tackle).toBe(75);
    expect(stored[0].power).toBe(85);
    expect(stored[0].shoot).toBe(90);
    expect(stored[0].skill).toBe(70);
    expect(stored[0].pass).toBe(65);
  });

  test('getSavedCards fills in default statsStyle for legacy cards missing the field', () => {
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
      cardId: 'card_legacy_stats_1',
      textFonts: { ...DEFAULT_TEXT_FONTS },
      imageFrameType: DEFAULT_IMAGE_FRAME_TYPE,
      imageCropFocus: DEFAULT_IMAGE_CROP_FOCUS,
      cardBorderShape: DEFAULT_CARD_BORDER_SHAPE,
      cardBorderColor: DEFAULT_CARD_BORDER_COLOR,
      // no statsStyle — simulates a card saved before this field existed
    };
    localStorage.setItem('football-cards', JSON.stringify([legacyCard]));

    const stored = getSavedCards();

    expect(stored[0].statsStyle).toBe(DEFAULT_STATS_STYLE);
  });

  test('getSavedCards fills in default Match Atk stats for legacy cards missing those fields', () => {
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
      cardId: 'card_legacy_stats_2',
      textFonts: { ...DEFAULT_TEXT_FONTS },
      imageFrameType: DEFAULT_IMAGE_FRAME_TYPE,
      imageCropFocus: DEFAULT_IMAGE_CROP_FOCUS,
      cardBorderShape: DEFAULT_CARD_BORDER_SHAPE,
      cardBorderColor: DEFAULT_CARD_BORDER_COLOR,
      // no speed, tackle, power, shoot, skill, pass
    };
    localStorage.setItem('football-cards', JSON.stringify([legacyCard]));

    const stored = getSavedCards();

    expect(stored[0].speed).toBe(50);
    expect(stored[0].tackle).toBe(50);
    expect(stored[0].power).toBe(50);
    expect(stored[0].shoot).toBe(50);
    expect(stored[0].skill).toBe(50);
    expect(stored[0].pass).toBe(50);
  });
});
