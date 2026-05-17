import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

export const AVAILABLE_FONTS = [
  'Roboto',
  'Playfair Display',
  'Montserrat',
  'Merriweather',
  'Poppins',
  'Bebas Neue',
  'Inter',
  'Bitter',
] as const;

interface FontSelectorProps {
  label: string;
  value: string;
  onChange: (font: string) => void;
  previewText?: string;
}

const toTestId = (label: string) =>
  `font-selector-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const FontSelector: React.FC<FontSelectorProps> = ({
  label,
  value,
  onChange,
  previewText,
}) => {
  const labelId = `${toTestId(label)}-label`;

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={handleChange}
        data-testid={toTestId(label)}
      >
        {AVAILABLE_FONTS.map((font) => (
          <MenuItem
            key={font}
            value={font}
            aria-label={font}
            data-testid={`font-option-${font.toLowerCase().replace(/ /g, '-')}`}
            sx={{ fontFamily: font }}
          >
            {previewText ? `${font} — ${previewText}` : font}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FontSelector;
