import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import CardCreator from './CardCreator';
import { CardProvider } from '../context/CardContext';
import {
  getClubs,
  getNationalities,
  getLeagues,
  getPositions,
} from '../services/api';
import { saveCard, getSavedCards } from '../services/storage';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock('../services/api');
jest.mock('../services/storage');

beforeEach(() => {
  (getClubs as jest.Mock).mockResolvedValue([
    { id: 1, name: 'Arsenal', league_id: 1, league_name: 'Premier League' },
  ]);
  (getNationalities as jest.Mock).mockResolvedValue([
    { id: 1, name: 'England' },
  ]);
  (getLeagues as jest.Mock).mockResolvedValue([
    { id: 1, name: 'Premier League' },
  ]);
  (getPositions as jest.Mock).mockResolvedValue([
    { code: 'FWD', name: 'Forward' },
  ]);
  (saveCard as jest.Mock).mockClear();
  (getSavedCards as jest.Mock).mockReturnValue([]);
});

describe('CardCreator — Accessible Button Names', () => {
  const renderCreator = () =>
    render(
      <CardProvider>
        <CardCreator />
      </CardProvider>,
    );

  test('"Load from Gallery" button has an accessible name', async () => {
    renderCreator();
    expect(
      await screen.findByRole('button', { name: /load from gallery/i }),
    ).toBeInTheDocument();
  });

  test('"Print Card" button has an accessible name', async () => {
    renderCreator();
    expect(
      await screen.findByRole('button', { name: /print card/i }),
    ).toBeInTheDocument();
  });

  test('"Save Card" button (rendered by CardForm) has an accessible name', async () => {
    renderCreator();
    expect(
      await screen.findByRole('button', { name: /save card/i }),
    ).toBeInTheDocument();
  });

  test('passes axe accessibility checks', async () => {
    const { container } = renderCreator();
    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
