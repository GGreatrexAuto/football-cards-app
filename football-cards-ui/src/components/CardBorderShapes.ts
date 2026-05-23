export type CardBorderShape =
  | 'none'
  | 'shield'
  | 'rectangle'
  | 'triangle'
  | 'explosion';

export const DEFAULT_CARD_BORDER_SHAPE: CardBorderShape = 'none';
export const DEFAULT_CARD_BORDER_COLOR = '#ffffff';

export const BORDER_SHAPE_PATHS: Record<
  Exclude<CardBorderShape, 'none'>,
  string
> = {
  rectangle: 'M 5,5 L 95,5 L 95,95 L 5,95 Z',
  shield: 'M 10,8 L 90,8 L 90,62 Q 90,80 50,92 Q 10,80 10,62 Z',
  triangle: 'M 50,8 L 93,92 L 7,92 Z',
  explosion:
    'M 50,8 L 59.6,26.9 L 79.7,20.3 L 73.1,40.4 L 92,50 L 73.1,59.6 L 79.7,79.7 L 59.6,73.1 L 50,92 L 40.4,73.1 L 20.3,79.7 L 26.9,59.6 L 8,50 L 26.9,40.4 L 20.3,20.3 L 40.4,26.9 Z',
};

export const BORDER_SHAPE_LABELS: Record<CardBorderShape, string> = {
  none: 'None',
  rectangle: 'Rectangle',
  shield: 'Shield',
  triangle: 'Triangle',
  explosion: 'Explosion',
};
