import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  CardProvider,
  useCard,
  DEFAULT_TEXT_FONTS,
  DEFAULT_IMAGE_FRAME_TYPE,
  DEFAULT_IMAGE_CROP_FOCUS,
  DEFAULT_STATS_STYLE,
} from './CardContext';

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
      <div data-testid="imageFrameType">{card.imageFrameType}</div>
      <div data-testid="imageCropFocus">{card.imageCropFocus}</div>
      <div data-testid="statsStyle">{card.statsStyle}</div>
      <div data-testid="speed">{card.speed}</div>
      <div data-testid="tackle">{card.tackle}</div>
      <div data-testid="power">{card.power}</div>
      <div data-testid="shoot">{card.shoot}</div>
      <div data-testid="skill">{card.skill}</div>
      <div data-testid="pass">{card.pass}</div>
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
      <button onClick={() => updateCard({ imageFrameType: 'fullBody' })}>
        update frame type
      </button>
      <button onClick={() => updateCard({ imageCropFocus: 'bottom' })}>
        update crop focus
      </button>
      <button onClick={() => updateCard({ statsStyle: 'matchAtk' })}>
        update stats style
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

  test('imageFrameType defaults to face', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    expect(screen.getByTestId('imageFrameType')).toHaveTextContent(
      DEFAULT_IMAGE_FRAME_TYPE,
    );
  });

  test('imageCropFocus defaults to top', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    expect(screen.getByTestId('imageCropFocus')).toHaveTextContent(
      DEFAULT_IMAGE_CROP_FOCUS,
    );
  });

  test('updateCard propagates imageFrameType to consumers', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    fireEvent.click(screen.getByText('update frame type'));
    expect(screen.getByTestId('imageFrameType')).toHaveTextContent('fullBody');
  });

  test('updateCard propagates imageCropFocus to consumers', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    fireEvent.click(screen.getByText('update crop focus'));
    expect(screen.getByTestId('imageCropFocus')).toHaveTextContent('bottom');
  });

  test('resetCard restores imageFrameType and imageCropFocus to defaults', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    fireEvent.click(screen.getByText('update frame type'));
    fireEvent.click(screen.getByText('update crop focus'));
    expect(screen.getByTestId('imageFrameType')).toHaveTextContent('fullBody');
    expect(screen.getByTestId('imageCropFocus')).toHaveTextContent('bottom');

    fireEvent.click(screen.getByText('reset'));
    expect(screen.getByTestId('imageFrameType')).toHaveTextContent(
      DEFAULT_IMAGE_FRAME_TYPE,
    );
    expect(screen.getByTestId('imageCropFocus')).toHaveTextContent(
      DEFAULT_IMAGE_CROP_FOCUS,
    );
  });

  test('statsStyle defaults to adrenaline', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    expect(screen.getByTestId('statsStyle')).toHaveTextContent(
      DEFAULT_STATS_STYLE,
    );
  });

  test('Match Atk stats default to 50', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    expect(screen.getByTestId('speed')).toHaveTextContent('50');
    expect(screen.getByTestId('tackle')).toHaveTextContent('50');
    expect(screen.getByTestId('power')).toHaveTextContent('50');
    expect(screen.getByTestId('shoot')).toHaveTextContent('50');
    expect(screen.getByTestId('skill')).toHaveTextContent('50');
    expect(screen.getByTestId('pass')).toHaveTextContent('50');
  });

  test('updateCard propagates statsStyle to consumers', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    fireEvent.click(screen.getByText('update stats style'));
    expect(screen.getByTestId('statsStyle')).toHaveTextContent('matchAtk');
  });

  test('resetCard restores statsStyle and Match Atk stats to defaults', () => {
    render(
      <CardProvider>
        <TestComponent />
      </CardProvider>,
    );

    fireEvent.click(screen.getByText('update stats style'));
    expect(screen.getByTestId('statsStyle')).toHaveTextContent('matchAtk');

    fireEvent.click(screen.getByText('reset'));
    expect(screen.getByTestId('statsStyle')).toHaveTextContent(
      DEFAULT_STATS_STYLE,
    );
    expect(screen.getByTestId('speed')).toHaveTextContent('50');
    expect(screen.getByTestId('tackle')).toHaveTextContent('50');
    expect(screen.getByTestId('power')).toHaveTextContent('50');
    expect(screen.getByTestId('shoot')).toHaveTextContent('50');
    expect(screen.getByTestId('skill')).toHaveTextContent('50');
    expect(screen.getByTestId('pass')).toHaveTextContent('50');
  });
});
