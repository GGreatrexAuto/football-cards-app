import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import PrintableCard from './PrintableCard';
import { CardProvider, useCard } from '../context/CardContext';
import type { CardLayout } from '../context/CardContext';

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

describe('PrintableCard — explicit cardData prop', () => {
  test('renders data from cardData prop instead of context', () => {
    const explicitCard = {
      playerName: 'Direct Prop Player',
      club: 'Prop FC',
      nationality: 'Propland',
      nationalityCode: 'PP',
      nationalityDisplay: 'text' as const,
      league: 'Prop League',
      position: 'GK',
      preferredFoot: 'Right',
      defence: 10,
      control: 20,
      attack: 30,
      rating: 20,
      statsStyle: 'adrenaline' as const,
      speed: 50,
      tackle: 50,
      power: 50,
      shoot: 50,
      skill: 50,
      pass: 50,
      playerPhoto: null,
      cardBackground: null,
      cardId: 'prop-card',
      textFonts: {
        playerName: 'Roboto',
        clubText: 'Roboto',
        countryText: 'Roboto',
        statsText: 'Roboto',
      },
      imageFrameType: 'face' as const,
      imageCropFocus: 'top' as const,
      cardBorderShape: 'none' as const,
      cardBorderColor: '#ffffff',
      cardType: 'club' as const,
      cardLayout: 'default' as const,
      textColors: {
        playerName: '#ffffff',
        clubText: '#ffffff',
        countryText: '#ffffff',
        statsText: '#ffffff',
      },
    };

    render(
      <CardProvider>
        <PrintableCard cardData={explicitCard} />
      </CardProvider>,
    );

    expect(screen.getByText('Direct Prop Player')).toBeInTheDocument();
    expect(screen.getByTestId('player-name-text')).toHaveTextContent(
      'Direct Prop Player',
    );
  });
});

describe('PrintableCard — Match Atk Stats Style', () => {
  const MatchAtkSetup: React.FC = () => {
    const { updateCard } = useCard();

    useEffect(() => {
      updateCard({
        playerName: 'Match Player',
        statsStyle: 'matchAtk',
        speed: 80,
        tackle: 60,
        power: 70,
        shoot: 90,
        skill: 65,
        pass: 77,
        rating: 75,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <PrintableCard />;
  };

  const renderMatchAtkCard = () =>
    render(
      <CardProvider>
        <MatchAtkSetup />
      </CardProvider>,
    );

  test('renders SPD, TAC, PWR, SHT, SKL, PAS stat labels for matchAtk style', () => {
    renderMatchAtkCard();
    expect(screen.getByText('SPD')).toBeInTheDocument();
    expect(screen.getByText('TAC')).toBeInTheDocument();
    expect(screen.getByText('PWR')).toBeInTheDocument();
    expect(screen.getByText('SHT')).toBeInTheDocument();
    expect(screen.getByText('SKL')).toBeInTheDocument();
    expect(screen.getByText('PAS')).toBeInTheDocument();
  });

  test('does not render DEF, CTRL, ATT labels when statsStyle is matchAtk', () => {
    renderMatchAtkCard();
    expect(screen.queryByText('DEF')).not.toBeInTheDocument();
    expect(screen.queryByText('CTRL')).not.toBeInTheDocument();
    expect(screen.queryByText('ATT')).not.toBeInTheDocument();
  });

  test('renders Match Atk stat values', () => {
    renderMatchAtkCard();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('70')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('65')).toBeInTheDocument();
    expect(screen.getByText('77')).toBeInTheDocument();
  });

  test('passes axe accessibility checks with matchAtk style', async () => {
    const { container } = renderMatchAtkCard();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('PrintableCard — cardLayout variants', () => {
  const renderWithLayout = (layout: CardLayout) => {
    const Setup: React.FC = () => {
      const { updateCard } = useCard();
      useEffect(() => {
        updateCard({
          cardLayout: layout,
          playerName: 'Layout Test',
          defence: 70,
          control: 70,
          attack: 70,
          rating: 70,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return <PrintableCard />;
    };
    return render(
      <CardProvider>
        <Setup />
      </CardProvider>,
    );
  };

  test('largePhoto layout renders Avatar with data-photo-size 80', async () => {
    renderWithLayout('largePhoto');
    await screen.findByText('Layout Test');
    expect(screen.getByTestId('printable-card-avatar')).toHaveAttribute(
      'data-photo-size',
      '80',
    );
  });

  test('smallPhoto layout renders Avatar with data-photo-size 30', async () => {
    renderWithLayout('smallPhoto');
    await screen.findByText('Layout Test');
    expect(screen.getByTestId('printable-card-avatar')).toHaveAttribute(
      'data-photo-size',
      '30',
    );
  });

  test('default layout renders Avatar with data-photo-size 50', async () => {
    renderWithLayout('default');
    await screen.findByText('Layout Test');
    expect(screen.getByTestId('printable-card-avatar')).toHaveAttribute(
      'data-photo-size',
      '50',
    );
  });

  test('statsBottom layout: stats-section appears after rating-section in DOM', async () => {
    renderWithLayout('statsBottom');
    await screen.findByTestId('stat-value-rating');
    const ratingSection = screen.getByTestId('rating-section');
    const statsSection = screen.getByTestId('stats-section');
    expect(
      ratingSection.compareDocumentPosition(statsSection) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test('default layout: stats-section appears before rating-section in DOM', async () => {
    renderWithLayout('default');
    await screen.findByTestId('stat-value-rating');
    const ratingSection = screen.getByTestId('rating-section');
    const statsSection = screen.getByTestId('stats-section');
    expect(
      ratingSection.compareDocumentPosition(statsSection) &
        Node.DOCUMENT_POSITION_PRECEDING,
    ).toBeTruthy();
  });

  test('has no accessibility violations with statsBottom layout', async () => {
    const { container } = renderWithLayout('statsBottom');
    await screen.findByTestId('stat-value-rating');
    expect(await axe(container)).toHaveNoViolations();
  });
});
