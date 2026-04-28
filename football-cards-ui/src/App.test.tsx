import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./services/api', () => ({
  getClubs: jest.fn().mockResolvedValue([]),
  getNationalities: jest.fn().mockResolvedValue([]),
  getLeagues: jest.fn().mockResolvedValue([]),
  getPositions: jest.fn().mockResolvedValue(['GK', 'DEF', 'MID', 'FWD']),
}));

test('renders main title and navigation tabs', async () => {
  render(<App />);

  expect(screen.getByText(/football card creator/i)).toBeInTheDocument();
  expect(screen.getByText(/create card/i)).toBeInTheDocument();
  expect(screen.getByText(/my cards/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/save card/i)).toBeInTheDocument();
  });
});
