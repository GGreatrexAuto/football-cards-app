import React, { createContext, useContext, useState } from 'react';
import {
  type CardBorderShape,
  DEFAULT_CARD_BORDER_SHAPE,
  DEFAULT_CARD_BORDER_COLOR,
} from '../components/CardBorderShapes';

export type { CardBorderShape };
export { DEFAULT_CARD_BORDER_SHAPE, DEFAULT_CARD_BORDER_COLOR };

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

export type ImageFrameType = 'face' | 'headAndShoulders' | 'fullBody';
export type ImageCropFocus = 'top' | 'centre' | 'bottom';
export type NationalityDisplay = 'text' | 'flag' | 'both';
export type CardType = 'club' | 'national';
export type StatsStyle = 'adrenaline' | 'matchAtk';
export const DEFAULT_IMAGE_FRAME_TYPE: ImageFrameType = 'face';
export const DEFAULT_IMAGE_CROP_FOCUS: ImageCropFocus = 'top';
export const DEFAULT_STATS_STYLE: StatsStyle = 'adrenaline';

export interface CardState {
  playerName: string;
  club: string;
  nationality: string;
  nationalityCode: string;
  nationalityDisplay: NationalityDisplay;
  league: string;
  position: string;
  preferredFoot: string;
  defence: number;
  control: number;
  attack: number;
  rating: number;
  statsStyle: StatsStyle;
  speed: number;
  tackle: number;
  power: number;
  shoot: number;
  skill: number;
  pass: number;
  playerPhoto: string | null;
  cardBackground: string | null;
  cardId: string | null;
  textFonts: TextFonts;
  imageFrameType: ImageFrameType;
  imageCropFocus: ImageCropFocus;
  cardBorderShape: CardBorderShape;
  cardBorderColor: string;
  cardType: CardType;
}

const initialState: CardState = {
  playerName: '',
  club: '',
  nationality: '',
  nationalityCode: '',
  nationalityDisplay: 'text',
  league: '',
  position: '',
  preferredFoot: '',
  defence: 50,
  control: 50,
  attack: 50,
  rating: 50,
  statsStyle: 'adrenaline',
  speed: 50,
  tackle: 50,
  power: 50,
  shoot: 50,
  skill: 50,
  pass: 50,
  playerPhoto: null,
  cardBackground: null,
  cardId: null,
  textFonts: { ...DEFAULT_TEXT_FONTS },
  imageFrameType: DEFAULT_IMAGE_FRAME_TYPE,
  imageCropFocus: DEFAULT_IMAGE_CROP_FOCUS,
  cardBorderShape: DEFAULT_CARD_BORDER_SHAPE,
  cardBorderColor: DEFAULT_CARD_BORDER_COLOR,
  cardType: 'club',
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
