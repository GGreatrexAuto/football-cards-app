import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CardProvider, useCard, DEFAULT_TEXT_FONTS } from './CardContext';

const TestComponent = () => {
  const { card, updateCard, resetCard } = useCard();

  return (
    <div>
      <div data-testid="playerName">{card.playerName}</div>
      <div data-testid="defence">{card.defence}</div>
      <div data-testid="textFonts-playerName">{card.textFonts.playerName}</div>
      <div data-testid="textFonts-clubText">{card.textFonts.clubText}</div>
      <div data-testid="textFonts-countryText">
        {card.textFonts.countryText}
      </div>
      <div data-testid="textFonts-statsText">{card.textFonts.statsText}</div>
      <button onClick={() => updateCard({ playerName: 'Star Player' })}>
        update
      </button>
      <button
        onClick={() =>
          updateCard({
            textFonts: {
              playerName: 'Poppins',
              clubText: 'Inter',
              countryText: 'Bitter',
              statsText: 'Montserrat',
            },
          })
        }
      >
        update fonts
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

  test('initialState includes default textFonts', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    expect(screen.getByTestId('textFonts-playerName')).toHaveTextContent(
      DEFAULT_TEXT_FONTS.playerName,
    );
    expect(screen.getByTestId('textFonts-clubText')).toHaveTextContent(
      DEFAULT_TEXT_FONTS.clubText,
    );
    expect(screen.getByTestId('textFonts-countryText')).toHaveTextContent(
      DEFAULT_TEXT_FONTS.countryText,
    );
    expect(screen.getByTestId('textFonts-statsText')).toHaveTextContent(
      DEFAULT_TEXT_FONTS.statsText,
    );
  });

  test('updateCard merges textFonts correctly', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    fireEvent.click(screen.getByText('update fonts'));

    expect(screen.getByTestId('textFonts-playerName')).toHaveTextContent(
      'Poppins',
    );
    expect(screen.getByTestId('textFonts-clubText')).toHaveTextContent('Inter');
    expect(screen.getByTestId('textFonts-countryText')).toHaveTextContent(
      'Bitter',
    );
    expect(screen.getByTestId('textFonts-statsText')).toHaveTextContent(
      'Montserrat',
    );
  });

  test('resetCard restores textFonts to defaults', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    fireEvent.click(screen.getByText('update fonts'));
    expect(screen.getByTestId('textFonts-playerName')).toHaveTextContent(
      'Poppins',
    );

    fireEvent.click(screen.getByText('reset'));
    expect(screen.getByTestId('textFonts-playerName')).toHaveTextContent(
      DEFAULT_TEXT_FONTS.playerName,
    );
    expect(screen.getByTestId('textFonts-clubText')).toHaveTextContent(
      DEFAULT_TEXT_FONTS.clubText,
    );
    expect(screen.getByTestId('textFonts-countryText')).toHaveTextContent(
      DEFAULT_TEXT_FONTS.countryText,
    );
    expect(screen.getByTestId('textFonts-statsText')).toHaveTextContent(
      DEFAULT_TEXT_FONTS.statsText,
    );
  });
});
