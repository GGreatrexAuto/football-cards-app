import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CardProvider, useCard } from './CardContext';

const TestComponent = () => {
  const { card, updateCard, resetCard } = useCard();

  return (
    <div>
      <div data-testid="playerName">{card.playerName}</div>
      <div data-testid="defence">{card.defence}</div>
      <button onClick={() => updateCard({ playerName: 'Star Player' })}>
        update
      </button>
      <button onClick={() => resetCard()}>reset</button>
    </div>
  );
};

describe('CardContext', () => {
  test('useCard throws error when not in CardProvider', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useCard must be used within a CardProvider',
    );

    consoleError.mockRestore();
  });

  test('CardProvider provides default values and update persists', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    expect(screen.getByTestId('playerName')).toHaveTextContent('');
    expect(screen.getByTestId('defence')).toHaveTextContent('50');

    fireEvent.click(screen.getByText('update'));
    expect(screen.getByTestId('playerName')).toHaveTextContent('Star Player');
  });

  test('resetCard returns state to initial after update', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    fireEvent.click(screen.getByText('update'));
    expect(screen.getByTestId('playerName')).toHaveTextContent('Star Player');

    fireEvent.click(screen.getByText('reset'));
    expect(screen.getByTestId('playerName')).toHaveTextContent('');
    expect(screen.getByTestId('defence')).toHaveTextContent('50');
  });
});
