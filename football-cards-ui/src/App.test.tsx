import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import {
  getClubs,
  getNationalities,
  getLeagues,
  getPositions,
} from './services/api';

jest.mock('axios', () => ({
  create: jest.fn(() => ({ get: jest.fn() })),
}));
jest.mock('./services/api');

beforeEach(() => {
  (getClubs as jest.Mock).mockResolvedValue([]);
  (getNationalities as jest.Mock).mockResolvedValue([]);
  (getLeagues as jest.Mock).mockResolvedValue([]);
  (getPositions as jest.Mock).mockResolvedValue([
    { code: 'GK', name: 'Goalkeeper' },
    { code: 'DEF', name: 'Defender' },
    { code: 'MID', name: 'Midfielder' },
    { code: 'FWD', name: 'Forward' },
  ]);
});

test('renders main title and navigation tabs', async () => {
  render(<App />);

  expect(screen.getByText(/football card creator/i)).toBeInTheDocument();
  expect(screen.getByText(/create card/i)).toBeInTheDocument();
  expect(screen.getByText(/my cards/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/save card/i)).toBeInTheDocument();
  });
});
