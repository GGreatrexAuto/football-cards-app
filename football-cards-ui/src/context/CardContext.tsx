import React, { createContext, useContext, useState } from 'react';

export interface TextFonts {
  playerName: string;
  clubText: string;
  countryText: string;
  statsText: string;
}

export const DEFAULT_TEXT_FONTS: TextFonts = {
  playerName: 'Playfair Display',
  clubText: 'Roboto',
  countryText: 'Roboto',
  statsText: 'Roboto',
};

export interface CardState {
  playerName: string;
  club: string;
  nationality: string;
  league: string;
  position: string;
  preferredFoot: string;
  defence: number;
  control: number;
  attack: number;
  rating: number;
  playerPhoto: string | null;
  cardBackground: string | null;
  cardId: string | null;
  textFonts: TextFonts;
}

const initialState: CardState = {
  playerName: '',
  club: '',
  nationality: '',
  league: '',
  position: '',
  preferredFoot: '',
  defence: 50,
  control: 50,
  attack: 50,
  rating: 50,
  playerPhoto: null,
  cardBackground: null,
  cardId: null,
  textFonts: { ...DEFAULT_TEXT_FONTS },
};

interface CardContextType {
  card: CardState;
  updateCard: (updates: Partial<CardState>) => void;
  resetCard: () => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [card, setCard] = useState<CardState>(initialState);

  const updateCard = (updates: Partial<CardState>) => {
    setCard((prevCard) => ({ ...prevCard, ...updates }));
  };

  const resetCard = () => {
    setCard(initialState);
  };

  return (
    <CardContext.Provider value={{ card, updateCard, resetCard }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCard = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCard must be used within a CardProvider');
  }
  return context;
};
