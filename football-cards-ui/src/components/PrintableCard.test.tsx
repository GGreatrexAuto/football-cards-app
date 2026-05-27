import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import PrintableCard from './PrintableCard';
import { CardProvider, useCard } from '../context/CardContext';

// TestSetup seeds known card state via context before rendering PrintableCard.
// cardBorderShape: 'shield' ensures the decorative SVG overlay is rendered
// so we can assert it carries aria-hidden="true".
const TestSetup: React.FC = () => {
  const { updateCard } = useCard();

  useEffect(() => {
    updateCard({
      playerName: 'Aria Testworth',
      club: 'Test FC',
      nationality: 'Testland',
      league: 'Test League',
      position: 'FWD',
      defence: 42,
      control: 67,
      attack: 81,
      rating: 75,
      cardBorderShape: 'shield',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <PrintableCard />;
};

const renderCard = () =>
  render(
    <CardProvider>
      <TestSetup />
    </CardProvider>,
  );

describe('PrintableCard — Text Content', () => {
  test('renders player name as a text node', () => {
    renderCard();
    expect(screen.getByText('Aria Testworth')).toBeInTheDocument();
  });

  test('renders rating as a text node', () => {
    renderCard();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  test('renders DEF, CTRL, ATT stat labels as text nodes', () => {
    renderCard();
    expect(screen.getByText('DEF')).toBeInTheDocument();
    expect(screen.getByText('CTRL')).toBeInTheDocument();
    expect(screen.getByText('ATT')).toBeInTheDocument();
  });

  test('renders stat values as text nodes', () => {
    renderCard();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('67')).toBeInTheDocument();
    expect(screen.getByText('81')).toBeInTheDocument();
  });
});

describe('PrintableCard — Accessibility', () => {
  test('passes axe accessibility checks', async () => {
    const { container } = renderCard();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('decorative SVG border overlay is aria-hidden', () => {
    renderCard();
    // cardBorderShape: 'shield' set in TestSetup guarantees the overlay is rendered
    expect(screen.getByTestId('card-border-overlay')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
