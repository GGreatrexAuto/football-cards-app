import { CardState } from '../context/CardContext';

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
  return savedData ? JSON.parse(savedData) : [];
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
