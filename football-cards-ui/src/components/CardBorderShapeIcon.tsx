import React from 'react';
import { type CardBorderShape, BORDER_SHAPE_PATHS } from './CardBorderShapes';

interface CardBorderShapeIconProps {
  shape: CardBorderShape;
  size?: number;
}

const CardBorderShapeIcon: React.FC<CardBorderShapeIconProps> = ({
  shape,
  size = 20,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    aria-hidden="true"
    style={{ display: 'block' }}
  >
    {shape === 'none' ? (
      <>
        <rect
          x="8"
          y="8"
          width="84"
          height="84"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray="12 8"
        />
        <line
          x1="18"
          y1="18"
          x2="82"
          y2="82"
          stroke="currentColor"
          strokeWidth="6"
        />
      </>
    ) : (
      <path
        d={BORDER_SHAPE_PATHS[shape]}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

export default CardBorderShapeIcon;
