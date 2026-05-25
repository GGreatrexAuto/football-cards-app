import React from 'react';
import { Button, Box } from '@mui/material';
// import { Print, PhotoLibrary } from '@mui/icons-material';
import CardForm from './CardForm';
import CardPreview from './CardPreview';

interface CardCreatorProps {
  onNavigateToGallery?: () => void;
}

const CardCreator: React.FC<CardCreatorProps> = ({ onNavigateToGallery }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleLoadGallery = () => {
    if (onNavigateToGallery) {
      onNavigateToGallery();
    } else {
      alert('Gallery feature coming soon!');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1, order: { xs: 2, md: 1 } }}>
          <CardForm />
        </Box>
        <Box
          data-testid="card-preview-column"
          sx={{
            flex: 1,
            order: { xs: 1, md: 2 },
            position: { md: 'sticky' },
            top: { md: 2 },
            alignSelf: { md: 'flex-start' },
          }}
        >
          <CardPreview />
        </Box>
      </Box>
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="outlined" onClick={handleLoadGallery}>
          📚 Load from Gallery
        </Button>
        <Button variant="outlined" onClick={handlePrint}>
          🖨️ Print Card
        </Button>
      </Box>
    </Box>
  );
};

export default CardCreator;
