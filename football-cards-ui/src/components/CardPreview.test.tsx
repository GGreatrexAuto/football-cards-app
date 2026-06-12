import React, { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import CardPreview from './CardPreview';
import {
  CardProvider,
  useCard,
  DEFAULT_TEXT_FONTS,
  TextFonts,
} from '../context/CardContext';
import type { NationalityDisplay, CardLayout } from '../context/CardContext';

// Regression guard: this assignment will fail to compile if a new field is added
// to TextFonts without updating DEFAULT_TEXT_FONTS and all test fixtures.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _textFontsCompletenessCheck: TextFonts = DEFAULT_TEXT_FONTS;

const TestPreviewSetup = () => {
  const { updateCard } = useCard();

  useEffect(() => {
    updateCard({
      playerName: 'Test Player',
      club: 'Test FC',
      nationality: 'Testland',
      league: 'Test League',
      position: 'FWD',
      preferredFoot: 'Right',
      defence: 80,
      control: 70,
      attack: 90,
      playerPhoto: 'https://example.com/photo.jpg',
      cardBackground: 'https://example.com/background.png',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <CardPreview />;
};

const TestPreviewWithBg2 = () => {
  const { updateCard } = useCard();
  useEffect(() => {
    updateCard({ cardBackground: 'https://example.com/bg2.png' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <CardPreview />;
};

const TestPreviewWithBg3 = () => {
  const { updateCard } = useCard();
  useEffect(() => {
    updateCard({ cardBackground: 'https://example.com/bg3.png' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <CardPreview />;
};

const TestPreviewWithUpdate = () => {
  const { updateCard } = useCard();

  useEffect(() => {
    updateCard({ defence: 20, control: 20, attack: 20 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button
        onClick={() => updateCard({ defence: 100, control: 100, attack: 100 })}
      >
        Update Stats
      </button>
      <CardPreview />
    </>
  );
};

describe('CardPreview Component', () => {
  test('displays player info and rating based on stats', async () => {
    render(
      <CardProvider>
        <TestPreviewSetup />
      </CardProvider>,
    );

    expect(await screen.findByText('Test Player')).toBeInTheDocument();
    expect(screen.getByText('Test FC')).toBeInTheDocument();
    expect(screen.getByText('Testland')).toBeInTheDocument();
    expect(screen.getByText('Test League')).toBeInTheDocument();
    expect(screen.getByText(/FWD/)).toBeInTheDocument();

    expect(screen.getByText('80', { selector: 'h6' })).toBeInTheDocument();
    expect(screen.getByText('70', { selector: 'h6' })).toBeInTheDocument();
    expect(screen.getByText('90', { selector: 'h6' })).toBeInTheDocument();

    // Computed rating == 80 (h4 element)
    expect(screen.getByText('80', { selector: 'div' })).toBeInTheDocument();
  });

  test('recomputes rating when stats change', async () => {
    render(
      <CardProvider>
        <TestPreviewWithUpdate />
      </CardProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('20', { selector: 'div' })).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: /Update Stats/i }),
    );

    await waitFor(() => {
      expect(screen.getByText('100', { selector: 'div' })).toBeInTheDocument();
    });
  });

  test('applies gradient background with correct rgba opacity', async () => {
    render(
      <CardProvider>
        <TestPreviewSetup />
      </CardProvider>,
    );

    const previewCard = await screen.findByTestId('card-preview');
    const backgroundCss = previewCard.dataset.backgroundCss || '';

    // Verify gradient is semi-transparent (rgba with 0.7 opacity)
    expect(backgroundCss).toContain(
      'linear-gradient(135deg, rgba(25, 118, 210, 0.7) 0%, rgba(255, 193, 7, 0.7) 100%)',
    );
  });

  test('includes cardBackground image URL in background style', async () => {
    render(
      <CardProvider>
        <TestPreviewSetup />
      </CardProvider>,
    );

    const previewCard = await screen.findByTestId('card-preview');
    const backgroundImage = previewCard.dataset.backgroundImage || '';
    const photo = await screen.findByTestId('player-photo');

    // Verify the background URL is present and the player photo is rendered
    expect(backgroundImage).toBe('https://example.com/background.png');
    expect(photo).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  test('applies second distinct cardBackground URL in background style', async () => {
    render(
      <CardProvider>
        <TestPreviewWithBg2 />
      </CardProvider>,
    );
    const previewCard = await screen.findByTestId('card-preview');
    expect(previewCard.dataset.backgroundImage).toBe(
      'https://example.com/bg2.png',
    );
  });

  test('applies third distinct cardBackground URL in background style', async () => {
    render(
      <CardProvider>
        <TestPreviewWithBg3 />
      </CardProvider>,
    );
    const previewCard = await screen.findByTestId('card-preview');
    expect(previewCard.dataset.backgroundImage).toBe(
      'https://example.com/bg3.png',
    );
  });

  test('renders player photo when provided', async () => {
    render(
      <CardProvider>
        <TestPreviewSetup />
      </CardProvider>,
    );

    const photo = await screen.findByTestId('player-photo');
    expect(photo).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  test('renders correctly when window is resized for responsive use', async () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));

    render(
      <CardProvider>
        <TestPreviewSetup />
      </CardProvider>,
    );

    const previewCard = await screen.findByTestId('card-preview');
    expect(previewCard).toBeVisible();

    window.innerWidth = 1200;
    window.dispatchEvent(new Event('resize'));

    expect(previewCard).toBeVisible();
  });

  test('displays gradient and image with correct layering', async () => {
    render(
      <CardProvider>
        <TestPreviewSetup />
      </CardProvider>,
    );

    const previewCard = await screen.findByTestId('card-preview');
    const backgroundCss = previewCard.dataset.backgroundCss || '';
    const backgroundImage = previewCard.dataset.backgroundImage || '';

    // Verify both gradient and image are present
    expect(backgroundCss).toContain('linear-gradient');
    expect(backgroundCss).toContain('url(https://example.com/background.png)');
    expect(backgroundImage).toBe('https://example.com/background.png');
  });

  test('renders with gradient only when no cardBackground is set', async () => {
    const TestPreviewNoBackground = () => {
      const { updateCard } = useCard();

      useEffect(() => {
        updateCard({
          playerName: 'Test Player',
          cardBackground: null, // No background
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return <CardPreview />;
    };

    render(
      <CardProvider>
        <TestPreviewNoBackground />
      </CardProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test Player')).toBeInTheDocument();
    });

    const previewCard = await screen.findByTestId('card-preview');
    const backgroundCss = previewCard.dataset.backgroundCss || '';
    const backgroundImage = previewCard.dataset.backgroundImage || '';
    // Verify only gradient, no URL when cardBackground is null
    expect(backgroundCss).toContain('linear-gradient');
    expect(backgroundImage).toBe('');
  });

  describe('font customisation', () => {
    const TestPreviewWithFonts = ({
      playerNameFont,
      clubTextFont,
      countryTextFont,
      statsTextFont = 'Roboto',
    }: {
      playerNameFont: string;
      clubTextFont: string;
      countryTextFont: string;
      statsTextFont?: string;
    }) => {
      const { updateCard } = useCard();

      useEffect(() => {
        updateCard({
          playerName: 'Font Test',
          club: 'Font Club',
          nationality: 'Font Land',
          textFonts: {
            playerName: playerNameFont,
            clubText: clubTextFont,
            countryText: countryTextFont,
            statsText: statsTextFont,
          },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return <CardPreview />;
    };

    test('applies playerName font to player name element', async () => {
      render(
        <CardProvider>
          <TestPreviewWithFonts
            playerNameFont="Poppins"
            clubTextFont="Roboto"
            countryTextFont="Roboto"
          />
        </CardProvider>,
      );

      const nameEl = await screen.findByTestId('player-name-text');
      expect(nameEl).toHaveStyle({ fontFamily: 'Poppins' });
    });

    test('applies clubText font to club element', async () => {
      render(
        <CardProvider>
          <TestPreviewWithFonts
            playerNameFont="Roboto"
            clubTextFont="Montserrat"
            countryTextFont="Roboto"
          />
        </CardProvider>,
      );

      const clubEl = await screen.findByTestId('club-text');
      expect(clubEl).toHaveStyle({ fontFamily: 'Montserrat' });
    });

    test('applies countryText font to nationality element', async () => {
      render(
        <CardProvider>
          <TestPreviewWithFonts
            playerNameFont="Roboto"
            clubTextFont="Roboto"
            countryTextFont="Merriweather"
          />
        </CardProvider>,
      );

      const nationalityEl = await screen.findByTestId('nationality-text');
      expect(nationalityEl).toHaveStyle({ fontFamily: 'Merriweather' });
    });

    test('applies statsText font to stat values and labels', async () => {
      const TestPreviewWithStatFont = () => {
        const { updateCard } = useCard();
        useEffect(() => {
          updateCard({
            playerName: 'Stats Font Test',
            defence: 80,
            control: 70,
            attack: 90,
            textFonts: {
              playerName: 'Roboto',
              clubText: 'Roboto',
              countryText: 'Roboto',
              statsText: 'Bebas Neue',
            },
          });
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return <CardPreview />;
      };

      render(
        <CardProvider>
          <TestPreviewWithStatFont />
        </CardProvider>,
      );

      await screen.findByTestId('stat-value-defence');

      expect(screen.getByTestId('stat-value-defence')).toHaveStyle({
        fontFamily: 'Bebas Neue',
      });
      expect(screen.getByTestId('stat-label-def')).toHaveStyle({
        fontFamily: 'Bebas Neue',
      });
      expect(screen.getByTestId('stat-value-control')).toHaveStyle({
        fontFamily: 'Bebas Neue',
      });
      expect(screen.getByTestId('stat-label-ctrl')).toHaveStyle({
        fontFamily: 'Bebas Neue',
      });
      expect(screen.getByTestId('stat-value-attack')).toHaveStyle({
        fontFamily: 'Bebas Neue',
      });
      expect(screen.getByTestId('stat-label-att')).toHaveStyle({
        fontFamily: 'Bebas Neue',
      });
      expect(screen.getByTestId('stat-value-rating')).toHaveStyle({
        fontFamily: 'Bebas Neue',
      });
    });

    test('all four font fields are applied independently when set to different fonts', async () => {
      const TestPreviewAllFonts = () => {
        const { updateCard } = useCard();
        useEffect(() => {
          updateCard({
            playerName: 'Combo Test',
            club: 'Combo FC',
            nationality: 'Comboland',
            defence: 70,
            control: 75,
            attack: 80,
            textFonts: {
              playerName: 'Bebas Neue',
              clubText: 'Playfair Display',
              countryText: 'Inter',
              statsText: 'Merriweather',
            },
          });
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return <CardPreview />;
      };

      render(
        <CardProvider>
          <TestPreviewAllFonts />
        </CardProvider>,
      );

      const nameEl = await screen.findByTestId('player-name-text');
      expect(nameEl).toHaveStyle({ fontFamily: 'Bebas Neue' });

      const clubEl = await screen.findByTestId('club-text');
      expect(clubEl).toHaveStyle({ fontFamily: 'Playfair Display' });

      const nationalityEl = await screen.findByTestId('nationality-text');
      expect(nationalityEl).toHaveStyle({ fontFamily: 'Inter' });

      await screen.findByTestId('stat-value-defence');
      expect(screen.getByTestId('stat-value-defence')).toHaveStyle({
        fontFamily: 'Merriweather',
      });
    });
  });

  describe('image frame type and crop focus', () => {
    const renderWithFrame = (
      imageFrameType: 'face' | 'headAndShoulders' | 'fullBody',
      imageCropFocus: 'top' | 'centre' | 'bottom' = 'top',
    ) => {
      const Setup = () => {
        const { updateCard } = useCard();
        useEffect(() => {
          updateCard({
            playerPhoto: 'https://example.com/photo.jpg',
            imageFrameType,
            imageCropFocus,
          });
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return <CardPreview />;
      };
      return render(
        <CardProvider>
          <Setup />
        </CardProvider>,
      );
    };

    test('face frame applies border-radius 50%', async () => {
      renderWithFrame('face');
      const photo = await screen.findByTestId('player-photo');
      expect(photo).toHaveStyle({ borderRadius: '50%' });
    });

    test('headAndShoulders frame does not apply border-radius 50%', async () => {
      renderWithFrame('headAndShoulders');
      const photo = await screen.findByTestId('player-photo');
      expect(photo).not.toHaveStyle({ borderRadius: '50%' });
      expect(photo).toHaveStyle({ borderRadius: '8px' });
    });

    test('fullBody frame does not apply border-radius 50%', async () => {
      renderWithFrame('fullBody');
      const photo = await screen.findByTestId('player-photo');
      expect(photo).not.toHaveStyle({ borderRadius: '50%' });
      expect(photo).toHaveStyle({ borderRadius: '8px' });
    });

    test('top crop focus applies object-position top', async () => {
      renderWithFrame('face', 'top');
      const photo = await screen.findByTestId('player-photo');
      expect(photo).toHaveStyle({ objectPosition: 'top' });
    });

    test('centre crop focus applies object-position center', async () => {
      renderWithFrame('face', 'centre');
      const photo = await screen.findByTestId('player-photo');
      expect(photo).toHaveStyle({ objectPosition: 'center' });
    });

    test('bottom crop focus applies object-position bottom', async () => {
      renderWithFrame('face', 'bottom');
      const photo = await screen.findByTestId('player-photo');
      expect(photo).toHaveStyle({ objectPosition: 'bottom' });
    });

    test('alt text reflects active frame type and crop focus', async () => {
      renderWithFrame('headAndShoulders', 'bottom');
      const photo = await screen.findByTestId('player-photo');
      expect(photo).toHaveAttribute(
        'alt',
        'Player photo, head & shoulders, positioned at bottom',
      );
    });

    test('renders Avatar fallback when no photo is set', async () => {
      const NoPhotoSetup = () => {
        const { updateCard } = useCard();
        useEffect(() => {
          updateCard({ playerName: 'Fallback', playerPhoto: null });
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return <CardPreview />;
      };
      render(
        <CardProvider>
          <NoPhotoSetup />
        </CardProvider>,
      );

      const fallback = await screen.findByTestId('player-photo');
      expect(fallback.tagName).not.toBe('IMG');
      expect(screen.getByText('F')).toBeInTheDocument();
    });
  });

  describe('card border overlay', () => {
    const renderWithBorder = (opts: {
      cardBorderShape:
        | 'none'
        | 'shield'
        | 'rectangle'
        | 'triangle'
        | 'explosion';
      cardBorderColor?: string;
    }) => {
      const Setup = () => {
        const { updateCard } = useCard();
        useEffect(() => {
          updateCard(opts);
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return <CardPreview />;
      };
      return render(
        <CardProvider>
          <Setup />
        </CardProvider>,
      );
    };

    test('does not render border overlay when shape is none (default)', async () => {
      render(
        <CardProvider>
          <CardPreview />
        </CardProvider>,
      );
      await screen.findByTestId('card-preview');
      expect(
        screen.queryByTestId('card-border-overlay'),
      ).not.toBeInTheDocument();
    });

    test('renders SVG overlay when a border shape is set', async () => {
      renderWithBorder({ cardBorderShape: 'shield' });
      expect(
        await screen.findByTestId('card-border-overlay'),
      ).toBeInTheDocument();
    });

    test('renders SVG overlay for each non-none shape', async () => {
      for (const shape of ['rectangle', 'triangle', 'explosion'] as const) {
        const { unmount } = renderWithBorder({ cardBorderShape: shape });
        expect(
          await screen.findByTestId('card-border-overlay'),
        ).toBeInTheDocument();
        unmount();
      }
    });

    test('SVG overlay has aria-hidden attribute', async () => {
      renderWithBorder({ cardBorderShape: 'rectangle' });
      const overlay = await screen.findByTestId('card-border-overlay');
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
    });

    test('SVG path stroke matches the chosen border colour', async () => {
      renderWithBorder({
        cardBorderShape: 'shield',
        cardBorderColor: '#ff0000',
      });
      await screen.findByTestId('card-border-overlay');
      const path = await screen.findByTestId('card-border-path');
      expect(path.getAttribute('stroke')).toBe('#ff0000');
    });

    test('has no accessibility violations with a border enabled', async () => {
      const { container } = renderWithBorder({
        cardBorderShape: 'shield',
        cardBorderColor: '#ffffff',
      });
      await screen.findByTestId('card-border-overlay');
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('stats style', () => {
    const renderWithMatchAtk = (stats: {
      speed: number;
      tackle: number;
      power: number;
      shoot: number;
      skill: number;
      pass: number;
    }) => {
      const Setup = () => {
        const { updateCard } = useCard();
        useEffect(() => {
          updateCard({ statsStyle: 'matchAtk', ...stats });
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return <CardPreview />;
      };
      return render(
        <CardProvider>
          <Setup />
        </CardProvider>,
      );
    };

    test('renders DEF/CTRL/ATT stat labels when statsStyle is adrenaline (default)', async () => {
      render(
        <CardProvider>
          <TestPreviewSetup />
        </CardProvider>,
      );
      expect(await screen.findByTestId('stat-label-def')).toBeInTheDocument();
      expect(screen.getByTestId('stat-label-ctrl')).toBeInTheDocument();
      expect(screen.getByTestId('stat-label-att')).toBeInTheDocument();
      expect(screen.queryByTestId('stat-label-spd')).not.toBeInTheDocument();
    });

    test('renders SPD/TAC/PWR/SHT/SKL/PAS stat labels when statsStyle is matchAtk', async () => {
      renderWithMatchAtk({
        speed: 80,
        tackle: 60,
        power: 70,
        shoot: 90,
        skill: 65,
        pass: 75,
      });
      expect(await screen.findByTestId('stat-label-spd')).toBeInTheDocument();
      expect(screen.getByTestId('stat-label-tac')).toBeInTheDocument();
      expect(screen.getByTestId('stat-label-pwr')).toBeInTheDocument();
      expect(screen.getByTestId('stat-label-sht')).toBeInTheDocument();
      expect(screen.getByTestId('stat-label-skl')).toBeInTheDocument();
      expect(screen.getByTestId('stat-label-pas')).toBeInTheDocument();
      expect(screen.queryByTestId('stat-label-def')).not.toBeInTheDocument();
    });

    test('renders Match Atk stat values in the preview', async () => {
      renderWithMatchAtk({
        speed: 80,
        tackle: 60,
        power: 70,
        shoot: 90,
        skill: 65,
        pass: 75,
      });
      expect(await screen.findByTestId('stat-value-speed')).toHaveTextContent(
        '80',
      );
      expect(screen.getByTestId('stat-value-tackle')).toHaveTextContent('60');
      expect(screen.getByTestId('stat-value-power')).toHaveTextContent('70');
      expect(screen.getByTestId('stat-value-shoot')).toHaveTextContent('90');
      expect(screen.getByTestId('stat-value-skill')).toHaveTextContent('65');
      expect(screen.getByTestId('stat-value-pass')).toHaveTextContent('75');
    });

    test('computes weighted rating for matchAtk style', async () => {
      // SPD=80, TAC=60, PWR=70(×2), SHT=90(×2), SKL=65, PAS=75
      // = (80+60+140+180+65+75)/8 = 600/8 = 75
      renderWithMatchAtk({
        speed: 80,
        tackle: 60,
        power: 70,
        shoot: 90,
        skill: 65,
        pass: 75,
      });
      await waitFor(() => {
        expect(screen.getByTestId('stat-value-rating')).toHaveTextContent('75');
      });
    });

    test('has no accessibility violations when statsStyle is matchAtk', async () => {
      const { container } = renderWithMatchAtk({
        speed: 80,
        tackle: 60,
        power: 70,
        shoot: 90,
        skill: 65,
        pass: 75,
      });
      await screen.findByTestId('stat-label-spd');
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('nationality flag display', () => {
    const renderWithNationality = (opts: {
      nationality: string;
      nationalityCode: string;
      nationalityDisplay: NationalityDisplay;
    }) => {
      const Setup = () => {
        const { updateCard } = useCard();
        useEffect(() => {
          updateCard(opts);
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return <CardPreview />;
      };
      return render(
        <CardProvider>
          <Setup />
        </CardProvider>,
      );
    };

    test('shows only text when nationalityDisplay is text', async () => {
      renderWithNationality({
        nationality: 'England',
        nationalityCode: 'ENG',
        nationalityDisplay: 'text',
      });
      expect(await screen.findByTestId('nationality-text')).toBeInTheDocument();
      expect(screen.queryByTestId('nationality-flag')).not.toBeInTheDocument();
    });

    test('shows only flag when nationalityDisplay is flag', async () => {
      renderWithNationality({
        nationality: 'England',
        nationalityCode: 'ENG',
        nationalityDisplay: 'flag',
      });
      expect(await screen.findByTestId('nationality-flag')).toBeInTheDocument();
      expect(screen.queryByTestId('nationality-text')).not.toBeInTheDocument();
    });

    test('shows both flag and text when nationalityDisplay is both', async () => {
      renderWithNationality({
        nationality: 'England',
        nationalityCode: 'ENG',
        nationalityDisplay: 'both',
      });
      expect(await screen.findByTestId('nationality-flag')).toBeInTheDocument();
      expect(await screen.findByTestId('nationality-text')).toBeInTheDocument();
    });

    test('flag image has descriptive alt text', async () => {
      renderWithNationality({
        nationality: 'England',
        nationalityCode: 'ENG',
        nationalityDisplay: 'flag',
      });
      const flagImg = await screen.findByTestId('nationality-flag');
      expect(flagImg).toHaveAttribute('alt', 'England flag');
    });

    test('falls back to text when nationalityCode is unknown and display is flag', async () => {
      renderWithNationality({
        nationality: 'Testland',
        nationalityCode: 'XYZ',
        nationalityDisplay: 'flag',
      });
      expect(await screen.findByTestId('nationality-text')).toBeInTheDocument();
      expect(screen.queryByTestId('nationality-flag')).not.toBeInTheDocument();
    });

    test('has no accessibility violations in flag-only mode', async () => {
      const { container } = renderWithNationality({
        nationality: 'England',
        nationalityCode: 'ENG',
        nationalityDisplay: 'flag',
      });
      await screen.findByTestId('nationality-flag');
      expect(await axe(container)).toHaveNoViolations();
    });

    test('has no accessibility violations in both mode', async () => {
      const { container } = renderWithNationality({
        nationality: 'England',
        nationalityCode: 'ENG',
        nationalityDisplay: 'both',
      });
      await screen.findByTestId('nationality-flag');
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe('CardPreview — cardLayout variants', () => {
  const renderWithLayout = (layout: CardLayout, withPhoto = true) => {
    const Setup = () => {
      const { updateCard } = useCard();
      useEffect(() => {
        updateCard({
          cardLayout: layout,
          playerPhoto: withPhoto ? 'https://example.com/photo.jpg' : null,
          playerName: 'Layout Test',
          defence: 70,
          control: 70,
          attack: 70,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return <CardPreview />;
    };
    return render(
      <CardProvider>
        <Setup />
      </CardProvider>,
    );
  };

  test('largePhoto layout renders photo with maxWidth 180px', async () => {
    renderWithLayout('largePhoto');
    const photo = await screen.findByTestId('player-photo');
    expect(photo).toHaveStyle({ maxWidth: '180px' });
  });

  test('smallPhoto layout renders photo with maxWidth 60px', async () => {
    renderWithLayout('smallPhoto');
    const photo = await screen.findByTestId('player-photo');
    expect(photo).toHaveStyle({ maxWidth: '60px' });
  });

  test('default layout renders photo with maxWidth 120px', async () => {
    renderWithLayout('default');
    const photo = await screen.findByTestId('player-photo');
    expect(photo).toHaveStyle({ maxWidth: '120px' });
  });

  test('mediumPhoto layout renders photo with maxWidth 120px', async () => {
    renderWithLayout('mediumPhoto');
    const photo = await screen.findByTestId('player-photo');
    expect(photo).toHaveStyle({ maxWidth: '120px' });
  });

  test('statsBottom layout: stats-section appears after rating-section in the DOM', async () => {
    renderWithLayout('statsBottom');
    await screen.findByTestId('stat-value-rating');
    const ratingSection = screen.getByTestId('rating-section');
    const statsSection = screen.getByTestId('stats-section');
    // Node.DOCUMENT_POSITION_FOLLOWING means statsSection comes after ratingSection
    expect(
      ratingSection.compareDocumentPosition(statsSection) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test('default layout: stats-section appears before rating-section in the DOM', async () => {
    renderWithLayout('default');
    await screen.findByTestId('stat-value-rating');
    const ratingSection = screen.getByTestId('rating-section');
    const statsSection = screen.getByTestId('stats-section');
    // Node.DOCUMENT_POSITION_PRECEDING means statsSection comes before ratingSection
    expect(
      ratingSection.compareDocumentPosition(statsSection) &
        Node.DOCUMENT_POSITION_PRECEDING,
    ).toBeTruthy();
  });

  test('applies custom playerName textColor', async () => {
    const Setup = () => {
      const { updateCard } = useCard();
      useEffect(() => {
        updateCard({ textColors: { playerName: '#ff0000', clubText: '#ffffff', countryText: '#ffffff', statsText: '#ffffff' } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return <CardPreview />;
    };
    render(<CardProvider><Setup /></CardProvider>);
    const nameEl = await screen.findByTestId('player-name-text');
    expect(nameEl).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  test('has no accessibility violations with largePhoto layout', async () => {
    const { container } = renderWithLayout('largePhoto');
    await screen.findByTestId('player-photo');
    expect(await axe(container)).toHaveNoViolations();
  });

  test('has no accessibility violations with statsBottom layout', async () => {
    const { container } = renderWithLayout('statsBottom');
    await screen.findByTestId('stat-value-rating');
    expect(await axe(container)).toHaveNoViolations();
  });
});
