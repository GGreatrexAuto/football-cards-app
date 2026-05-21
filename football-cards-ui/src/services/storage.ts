import {
  CardState,
  DEFAULT_TEXT_FONTS,
  DEFAULT_IMAGE_FRAME_TYPE,
  DEFAULT_IMAGE_CROP_FOCUS,
} from '../context/CardContext';

const CARDS_KEY = 'football-cards';

export const generateCardId = (): string => {
  return `card_${new Date().getTime()}`;
};

export const saveCard = (cardData: CardState): void => {
  const savedCards = getSavedCards();
  const newCard = { ...cardData, cardId: generateCardId() };
  const updatedCards = [...savedCards, newCard];
  localStorage.setItem(CARDS_KEY, JSON.stringify(updatedCards));
};

export const getSavedCards = (): CardState[] => {
  const savedData = localStorage.getItem(CARDS_KEY);
  if (!savedData) return [];
  return (JSON.parse(savedData) as CardState[]).map((c) => ({
    ...c,
    textFonts: c.textFonts ?? { ...DEFAULT_TEXT_FONTS },
    imageFrameType: c.imageFrameType ?? DEFAULT_IMAGE_FRAME_TYPE,
    imageCropFocus: c.imageCropFocus ?? DEFAULT_IMAGE_CROP_FOCUS,
  }));
};

export const updateCard = (cardId: string, cardData: CardState): void => {
  const savedCards = getSavedCards();
  const updatedCards = savedCards.map((card) =>
    card.cardId === cardId ? cardData : card,
  );
  localStorage.setItem(CARDS_KEY, JSON.stringify(updatedCards));
};

export const deleteCard = (cardId: string): void => {
  const savedCards = getSavedCards();
  const updatedCards = savedCards.filter((card) => card.cardId !== cardId);
  localStorage.setItem(CARDS_KEY, JSON.stringify(updatedCards));
};
