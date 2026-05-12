import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { useCard } from '../context/CardContext';

const CardPreview: React.FC = () => {
  const { card, updateCard } = useCard();
  const {
    playerName,
    club,
    nationality,
    league,
    position,
    preferredFoot,
    defence,
    control,
    attack,
    rating,
    playerPhoto,
    cardBackground,
  } = card;

  useEffect(() => {
    const newRating = Math.round((defence + control + attack) / 3);
    if (newRating !== rating) {
      updateCard({ rating: newRating });
    }
  }, [defence, control, attack, rating, updateCard]);

  const cardStyle = {
    maxWidth: 350,
    margin: 'auto',
    mt: 2,
    backgroundImage: cardBackground
      ? `linear-gradient(135deg, rgba(25, 118, 210, 0.7) 0%, rgba(255, 193, 7, 0.7) 100%), url(${cardBackground})`
      : 'linear-gradient(135deg, rgba(25, 118, 210, 0.7) 0%, rgba(255, 193, 7, 0.7) 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    minHeight: 400,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
  };

  return (
    <Card
      sx={cardStyle}
      data-testid="card-preview"
      data-background-css={cardStyle.backgroundImage}
      data-background-image={cardBackground || ''}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Player Photo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar
            src={playerPhoto || undefined}
            sx={{
              width: 80,
              height: 80,
              bgcolor: playerPhoto ? 'transparent' : '#fff',
              border: '3px solid white',
            }}
          >
            {!playerPhoto && (
              <Typography variant="h6" sx={{ color: '#1976D2' }}>
                {playerName ? playerName.charAt(0).toUpperCase() : '?'}
              </Typography>
            )}
          </Avatar>
        </Box>

        {/* Player Name */}
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            mb: 1,
          }}
        >
          {playerName || 'Player Name'}
        </Typography>

        {/* Player Details */}
        <Box sx={{ mb: 2 }}>
          {club && (
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 0.5 }}>
              {club}
            </Typography>
          )}
          {nationality && (
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 0.5 }}>
              {nationality}
            </Typography>
          )}
          {league && (
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 0.5 }}>
              {league}
            </Typography>
          )}
          {(position || preferredFoot) && (
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              {position} {preferredFoot && `(${preferredFoot})`}
            </Typography>
          )}
        </Box>

        {/* Stats */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {defence}
              </Typography>
              <Typography variant="caption">DEF</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {control}
              </Typography>
              <Typography variant="caption">CTRL</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {attack}
              </Typography>
              <Typography variant="caption">ATT</Typography>
            </Box>
          </Box>

          {/* Rating */}
          <Box sx={{ textAlign: 'center', mt: 'auto' }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                border: '2px solid white',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.2)',
              }}
            >
              {rating}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardPreview;
