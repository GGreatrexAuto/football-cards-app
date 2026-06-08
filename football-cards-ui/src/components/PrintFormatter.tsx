import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  CircularProgress,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { CardState } from '../context/CardContext';
import { getSavedCards } from '../services/storage';
import PrintableCard from './PrintableCard';

type CardsPerPage = 1 | 2 | 4 | 6;

interface PrintFormatterProps {
  onNavigateToGallery?: () => void;
}

const CARDS_PER_PAGE_OPTIONS: CardsPerPage[] = [1, 2, 4, 6];

function chunk<T>(arr: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    pages.push(arr.slice(i, i + size));
  }
  return pages;
}

const PrintFormatter: React.FC<PrintFormatterProps> = ({
  onNavigateToGallery,
}) => {
  const [allCards, setAllCards] = useState<CardState[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [cardsPerPage, setCardsPerPage] = useState<CardsPerPage>(4);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async (): Promise<void> => {
      const saved = await Promise.resolve(getSavedCards());
      setAllCards(saved);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleToggleCard = (cardId: string): void => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const handleLayoutChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: CardsPerPage | null,
  ): void => {
    if (value !== null) {
      setCardsPerPage(value);
    }
  };

  const handlePrint = (): void => {
    const styleEl = document.createElement('style');
    styleEl.id = 'pf-page-override';
    styleEl.textContent = '@page { size: A4 portrait; margin: 0; }';
    document.head.appendChild(styleEl);
    document.body.classList.add('print-formatter');

    const cleanup = (): void => {
      document.body.classList.remove('print-formatter');
      styleEl.remove();
    };
    window.addEventListener('afterprint', cleanup, { once: true });
    window.print();
  };

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', py: 4 }}
        role="status"
        aria-live="polite"
        aria-label="Loading cards"
      >
        <CircularProgress data-testid="loading-spinner" />
      </Box>
    );
  }

  const selectedCards = allCards.filter(
    (c) => c.cardId && selectedIds.has(c.cardId),
  );
  const pages = chunk(selectedCards, cardsPerPage);
  const selectedCount = selectedIds.size;

  if (allCards.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No saved cards to print.
        </Typography>
        {onNavigateToGallery && (
          <Button variant="contained" onClick={onNavigateToGallery}>
            Go to My Cards
          </Button>
        )}
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Print Cards
        </Typography>

        {/* Card selection grid */}
        <Typography
          id="select-cards-heading"
          variant="subtitle1"
          gutterBottom
          sx={{ mt: 2 }}
        >
          Select cards to print
        </Typography>
        <Box
          component="ul"
          role="list"
          aria-labelledby="select-cards-heading"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            p: 0,
            m: 0,
            listStyle: 'none',
            mb: 3,
          }}
        >
          {allCards.map((card) => {
            const id = card.cardId!;
            const isSelected = selectedIds.has(id);
            const displayName = card.playerName || 'Unnamed Player';
            return (
              <Box
                component="li"
                key={id}
                onClick={() => handleToggleCard(id)}
                data-testid={`card-select-item-${id}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  p: 1,
                  border: '2px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  cursor: 'pointer',
                  minWidth: 100,
                  bgcolor: isSelected ? 'primary.50' : 'background.paper',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleToggleCard(id)}
                  onClick={(e) => e.stopPropagation()}
                  slotProps={{
                    input: { 'aria-label': `Select ${displayName}` },
                  }}
                  sx={{ p: 0 }}
                />
                <Avatar
                  src={card.playerPhoto || undefined}
                  sx={{ width: 40, height: 40, bgcolor: '#1976D2' }}
                >
                  {!card.playerPhoto && displayName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{ textAlign: 'center', fontWeight: 'bold' }}
                >
                  {displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {card.rating}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Layout selector */}
        <Box
          component="fieldset"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            mb: 3,
            display: 'inline-block',
          }}
        >
          <Typography component="legend" variant="subtitle2" sx={{ px: 1 }}>
            Cards per A4 page
          </Typography>
          <ToggleButtonGroup
            value={cardsPerPage}
            exclusive
            onChange={handleLayoutChange}
            aria-label="Cards per A4 page"
            size="small"
          >
            {CARDS_PER_PAGE_OPTIONS.map((n) => (
              <ToggleButton
                key={n}
                value={n}
                aria-label={`${n} card${n !== 1 ? 's' : ''} per page`}
                data-testid={`layout-option-${n}`}
              >
                {n}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Print button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={selectedCount === 0}
            aria-label={`Print ${selectedCount} selected card${selectedCount !== 1 ? 's' : ''}`}
            data-testid="print-selected-button"
          >
            Print Selected ({selectedCount})
          </Button>
        </Box>
      </Box>

      {/* Print-only output: rendered off-screen, made visible by print.css */}
      {selectedCount > 0 && (
        <Box
          className="print-formatter-output"
          aria-hidden="true"
          data-testid="print-formatter-output"
          sx={{
            position: 'absolute',
            left: '-9999px',
            top: 0,
            width: '210mm',
          }}
        >
          {pages.map((pageCards, pageIndex) => (
            <Box
              key={pageIndex}
              className="print-a4-sheet"
              data-testid={`print-a4-sheet-${pageIndex}`}
            >
              {pageCards.map((card) => (
                <PrintableCard key={card.cardId} cardData={card} />
              ))}
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default PrintFormatter;
