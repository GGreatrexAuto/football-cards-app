import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import { useCard } from '../context/CardContext';
import { getSavedCards, deleteCard } from '../services/storage';
import { CardState } from '../context/CardContext';

interface CardGalleryProps {
  onEditCard?: () => void;
  onCreateNew?: () => void;
}

const CardGallery: React.FC<CardGalleryProps> = ({
  onEditCard,
  onCreateNew,
}) => {
  const { updateCard, resetCard } = useCard();
  const [cards, setCards] = useState<CardState[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    cardId: string | null;
  }>({
    open: false,
    cardId: null,
  });
  const [pendingFocusCreateNew, setPendingFocusCreateNew] = useState(false);
  const createNewInHeaderRef = useRef<HTMLButtonElement>(null);
  const createNewInEmptyRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    if (pendingFocusCreateNew && !deleteDialog.open) {
      (createNewInHeaderRef.current || createNewInEmptyRef.current)?.focus();
      setPendingFocusCreateNew(false);
    }
  }, [pendingFocusCreateNew, deleteDialog.open]);

  const loadCards = () => {
    const savedCards = getSavedCards();
    setCards(savedCards);
  };

  const handleEditCard = (card: CardState) => {
    updateCard(card);
    if (onEditCard) {
      onEditCard();
    } else {
      alert('Card loaded for editing!');
    }
  };

  const handleDeleteClick = (cardId: string) => {
    setDeleteDialog({ open: true, cardId });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.cardId) {
      deleteCard(deleteDialog.cardId);
      loadCards(); // Reload cards after deletion
    }
    setDeleteDialog({ open: false, cardId: null });
    setPendingFocusCreateNew(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, cardId: null });
  };

  const handleCreateNew = () => {
    resetCard();
    if (onCreateNew) {
      onCreateNew();
    }
  };

  if (cards.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No saved cards yet. Create your first card!
        </Typography>
        <Button
          variant="contained"
          onClick={handleCreateNew}
          ref={createNewInEmptyRef}
          data-testid="create-new"
        >
          Create New Card
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5">Your Card Gallery</Typography>
        <Button
          variant="contained"
          onClick={handleCreateNew}
          ref={createNewInHeaderRef}
          data-testid="create-new"
        >
          Create New Card
        </Button>
      </Box>
      <Box role="list" sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {cards.map((card) => (
          <Box
            key={card.cardId}
            role="listitem"
            sx={{ flex: '1 1 300px', maxWidth: '345px', margin: 'auto' }}
          >
            <Card>
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar
                    src={card.playerPhoto || undefined}
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 2,
                      bgcolor: card.playerPhoto ? 'transparent' : '#1976D2',
                    }}
                  >
                    {!card.playerPhoto && card.playerName
                      ? card.playerName.charAt(0).toUpperCase()
                      : '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {card.playerName || 'Unnamed Player'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.club} • {card.position}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{card.rating}</Typography>
                    <Typography variant="caption">Rating</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEditCard(card)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(card.cardId!)}
                      aria-label={`Delete ${card.playerName || 'Unnamed Player'}`}
                      data-testid="delete-card"
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        data-testid="delete-dialog"
      >
        <DialogTitle>Delete Card</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this card? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardGallery;
