import React, { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
});
