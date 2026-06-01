import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import PrintFormatter from './PrintFormatter';
import { CardProvider, CardState } from '../context/CardContext';
import { getSavedCards } from '../services/storage';

jest.mock('../services/storage');
jest.mock('./PrintableCard', () => {
  const MockPrintableCard = ({ cardData }: { cardData?: CardState }) => (
    <div data-testid={`mock-printable-card-${cardData?.cardId ?? 'context'}`}>
      {cardData?.playerName ?? 'context card'}
    </div>
  );
  MockPrintableCard.displayName = 'MockPrintableCard';
  return MockPrintableCard;
});

const makeCard = (overrides: Partial<CardState> = {}): CardState =>
  ({
    cardId: 'card1',
    playerName: 'Alice',
    club: 'Alpha FC',
    nationality: 'Aland',
    nationalityCode: 'AL',
    nationalityDisplay: 'text',
    league: 'Alpha League',
    position: 'MID',
    preferredFoot: 'Right',
    defence: 40,
    control: 50,
    attack: 60,
    rating: 50,
    statsStyle: 'adrenaline',
    speed: 50,
    tackle: 50,
    power: 50,
    shoot: 50,
    skill: 50,
    pass: 50,
    playerPhoto: null,
    cardBackground: null,
    textFonts: {
      playerName: 'Roboto',
      clubText: 'Roboto',
      countryText: 'Roboto',
      statsText: 'Roboto',
    },
    imageFrameType: 'face',
    imageCropFocus: 'top',
    cardBorderShape: 'none',
    cardBorderColor: '#ffffff',
    cardType: 'club',
    ...overrides,
  }) as CardState;

const CARD_1 = makeCard({ cardId: 'card1', playerName: 'Alice', rating: 50 });
const CARD_2 = makeCard({
  cardId: 'card2',
  playerName: 'Bob',
  rating: 65,
});

const renderFormatter = (props: { onNavigateToGallery?: () => void } = {}) =>
  render(
    <CardProvider>
      <PrintFormatter {...props} />
    </CardProvider>,
  );

describe('PrintFormatter — Loading', () => {
  test('renders loading spinner while cards load', () => {
    const pendingPromise = new Promise<CardState[]>(() => {});
    (getSavedCards as jest.Mock).mockReturnValue(pendingPromise);
    renderFormatter();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});

describe('PrintFormatter — Empty State', () => {
  beforeEach(() => {
    (getSavedCards as jest.Mock).mockReturnValue([]);
  });

  test('shows empty state message when no cards saved', async () => {
    renderFormatter();
    expect(
      await screen.findByText(/no saved cards to print/i),
    ).toBeInTheDocument();
  });

  test('calls onNavigateToGallery when "Go to My Cards" is clicked', async () => {
    const onNavigate = jest.fn();
    renderFormatter({ onNavigateToGallery: onNavigate });
    const btn = await screen.findByRole('button', { name: /go to my cards/i });
    await userEvent.click(btn);
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});

describe('PrintFormatter — Card Selection', () => {
  beforeEach(() => {
    (getSavedCards as jest.Mock).mockReturnValue([CARD_1, CARD_2]);
  });

  test('renders card selection items for each saved card', async () => {
    renderFormatter();
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  test('print button is disabled when no cards selected', async () => {
    renderFormatter();
    await screen.findByText('Alice');
    expect(screen.getByTestId('print-selected-button')).toBeDisabled();
  });

  test('selecting a card enables the print button and updates count', async () => {
    renderFormatter();
    await screen.findByText('Alice');
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select alice/i }),
    );
    expect(screen.getByTestId('print-selected-button')).not.toBeDisabled();
    expect(
      screen.getByRole('button', { name: /print 1 selected card/i }),
    ).toBeInTheDocument();
  });

  test('deselecting a card decrements the count', async () => {
    renderFormatter();
    await screen.findByText('Alice');
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select alice/i }),
    );
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select bob/i }),
    );
    expect(
      screen.getByRole('button', { name: /print 2 selected cards/i }),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select alice/i }),
    );
    expect(
      screen.getByRole('button', { name: /print 1 selected card/i }),
    ).toBeInTheDocument();
  });

  test('renders print output only when cards are selected', async () => {
    renderFormatter();
    await screen.findByText('Alice');
    expect(
      screen.queryByTestId('print-formatter-output'),
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select alice/i }),
    );
    expect(screen.getByTestId('print-formatter-output')).toBeInTheDocument();
    expect(screen.getByTestId('mock-printable-card-card1')).toBeInTheDocument();
  });

  test('clicking a card tile toggles its checkbox', async () => {
    renderFormatter();
    await screen.findByText('Alice');
    await userEvent.click(screen.getByTestId('card-select-item-card1'));
    expect(
      screen.getByRole('button', { name: /print 1 selected card/i }),
    ).toBeInTheDocument();
  });
});

describe('PrintFormatter — Layout Selector', () => {
  beforeEach(() => {
    (getSavedCards as jest.Mock).mockReturnValue([CARD_1, CARD_2]);
  });

  test('renders all four layout options', async () => {
    renderFormatter();
    await screen.findByText('Alice');
    expect(screen.getByTestId('layout-option-1')).toBeInTheDocument();
    expect(screen.getByTestId('layout-option-2')).toBeInTheDocument();
    expect(screen.getByTestId('layout-option-4')).toBeInTheDocument();
    expect(screen.getByTestId('layout-option-6')).toBeInTheDocument();
  });

  test('default layout is 4 cards per page', async () => {
    renderFormatter();
    await screen.findByText('Alice');
    expect(screen.getByTestId('layout-option-4')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('clicking a layout option selects it', async () => {
    renderFormatter();
    await screen.findByText('Alice');
    await userEvent.click(screen.getByTestId('layout-option-2'));
    await waitFor(() => {
      expect(screen.getByTestId('layout-option-2')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });
  });
});

describe('PrintFormatter — Print', () => {
  beforeEach(() => {
    (getSavedCards as jest.Mock).mockReturnValue([CARD_1, CARD_2]);
  });

  test('clicking Print Selected calls window.print', async () => {
    const printSpy = jest
      .spyOn(window, 'print')
      .mockImplementation(() => undefined);
    renderFormatter();
    await screen.findByText('Alice');
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select alice/i }),
    );
    await userEvent.click(screen.getByTestId('print-selected-button'));
    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  test('print adds and removes print-formatter class on body', async () => {
    const printSpy = jest.spyOn(window, 'print').mockImplementation(() => {
      window.dispatchEvent(new Event('afterprint'));
    });
    renderFormatter();
    await screen.findByText('Alice');
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select alice/i }),
    );
    await userEvent.click(screen.getByTestId('print-selected-button'));
    await waitFor(() => {
      expect(document.body.classList.contains('print-formatter')).toBe(false);
    });
    printSpy.mockRestore();
  });

  test('grouping: 2 selected cards with layout=1 produces 2 A4 sheets', async () => {
    renderFormatter();
    await screen.findByText('Alice');
    await userEvent.click(screen.getByTestId('layout-option-1'));
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select alice/i }),
    );
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select bob/i }),
    );
    expect(screen.getByTestId('print-a4-sheet-0')).toBeInTheDocument();
    expect(screen.getByTestId('print-a4-sheet-1')).toBeInTheDocument();
  });

  test('grouping: 2 selected cards with layout=2 produces 1 A4 sheet', async () => {
    renderFormatter();
    await screen.findByText('Alice');
    await userEvent.click(screen.getByTestId('layout-option-2'));
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select alice/i }),
    );
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select bob/i }),
    );
    expect(screen.getByTestId('print-a4-sheet-0')).toBeInTheDocument();
    expect(screen.queryByTestId('print-a4-sheet-1')).not.toBeInTheDocument();
  });
});

describe('PrintFormatter — Accessibility', () => {
  test('passes axe accessibility checks with no cards', async () => {
    (getSavedCards as jest.Mock).mockReturnValue([]);
    const { container } = renderFormatter();
    await screen.findByText(/no saved cards to print/i);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('passes axe accessibility checks with cards loaded', async () => {
    (getSavedCards as jest.Mock).mockReturnValue([CARD_1, CARD_2]);
    const { container } = renderFormatter();
    await screen.findByText('Alice');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
