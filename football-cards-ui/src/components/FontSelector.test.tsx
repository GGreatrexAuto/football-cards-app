import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FontSelector, { AVAILABLE_FONTS } from './FontSelector';

const renderSelector = (
  value = 'Roboto',
  onChange = jest.fn(),
  label = 'Player Name Font',
) => render(<FontSelector label={label} value={value} onChange={onChange} />);

describe('FontSelector Component', () => {
  test('renders with the given label', () => {
    renderSelector();
    expect(screen.getByLabelText('Player Name Font')).toBeInTheDocument();
  });

  test('shows the current value as selected', () => {
    renderSelector('Poppins');
    expect(screen.getByRole('combobox')).toHaveTextContent('Poppins');
  });

  test('renders data-testid based on label', () => {
    renderSelector('Roboto', jest.fn(), 'Club / League / Position Font');
    expect(
      screen.getByTestId('font-selector-club-league-position-font'),
    ).toBeInTheDocument();
  });

  test('calls onChange with the selected font name', async () => {
    const onChange = jest.fn();
    renderSelector('Roboto', onChange);
    await userEvent.click(screen.getByRole('combobox'));
    const montserratOption = await screen.findByTestId(
      'font-option-montserrat',
    );
    await userEvent.click(montserratOption);
    expect(onChange).toHaveBeenCalledWith('Montserrat');
  });

  test('renders all available fonts as options', async () => {
    renderSelector();
    await userEvent.click(screen.getByRole('combobox'));
    for (const font of AVAILABLE_FONTS) {
      const testId = `font-option-${font.toLowerCase().replace(/ /g, '-')}`;
      expect(await screen.findByTestId(testId)).toBeInTheDocument();
    }
  });

  test('each font option has aria-label attribute', async () => {
    renderSelector();
    await userEvent.click(screen.getByRole('combobox'));
    for (const font of AVAILABLE_FONTS) {
      const testId = `font-option-${font.toLowerCase().replace(/ /g, '-')}`;
      const option = await screen.findByTestId(testId);
      expect(option).toHaveAttribute('aria-label', font);
    }
  });

  test('shows previewText appended to each option when provided', async () => {
    render(
      <FontSelector
        label="Player Name Font"
        value="Roboto"
        onChange={jest.fn()}
        previewText="John Smith"
      />,
    );
    await userEvent.click(screen.getByRole('combobox'));
    const robotoOption = await screen.findByTestId('font-option-roboto');
    expect(robotoOption).toHaveTextContent('Roboto — John Smith');
  });
});
