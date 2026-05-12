import React, { useEffect } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CardPreview from './CardPreview';
import { CardProvider, useCard } from '../context/CardContext';

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
    const avatar = await screen.findByTestId('player-photo');
    const photo = within(avatar).getByRole('img');

    // Verify the background URL is present and the player photo is rendered
    expect(backgroundImage).toBe('https://example.com/background.png');
    expect(photo).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  test('renders player photo when provided', async () => {
    render(
      <CardProvider>
        <TestPreviewSetup />
      </CardProvider>,
    );

    const avatar = await screen.findByTestId('player-photo');
    const photo = within(avatar).getByRole('img');

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
});
