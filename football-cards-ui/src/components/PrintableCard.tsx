import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { useCard } from '../context/CardContext';

const PrintableCard: React.FC = () => {
  const { card } = useCard();
  const {
    playerName,
    club,
    nationality,
    position,
    preferredFoot,
    defence,
    control,
    attack,
    rating,
    playerPhoto,
    cardBackground,
  } = card;

  const cardStyle = {
    width: '3.5in',
    height: '2.5in',
    background: cardBackground
      ? `linear-gradient(135deg, #1976D2 0%, #FFC107 100%), url(${cardBackground})`
      : 'linear-gradient(135deg, #1976D2 0%, #FFC107 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    pageBreakInside: 'avoid',
    margin: '0.25in',
  };

  return (
    <Card className="printable-card" sx={cardStyle}>
      <CardContent
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 1 }}
      >
        {/* Player Photo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
          <Avatar
            src={playerPhoto || undefined}
            sx={{
              width: 50,
              height: 50,
              bgcolor: playerPhoto ? 'transparent' : '#fff',
              border: '2px solid white',
            }}
          >
            {!playerPhoto && (
              <Typography
                variant="h6"
                sx={{ color: '#1976D2', fontSize: '1.2rem' }}
              >
                {playerName ? playerName.charAt(0).toUpperCase() : '?'}
              </Typography>
            )}
          </Avatar>
        </Box>

        {/* Player Name */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            mb: 0.5,
          }}
        >
          {playerName || 'Player Name'}
        </Typography>

        {/* Player Details */}
        <Box sx={{ mb: 0.5 }}>
          {club && (
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', fontSize: '0.7rem', mb: 0.2 }}
            >
              {club}
            </Typography>
          )}
          {nationality && (
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', fontSize: '0.7rem', mb: 0.2 }}
            >
              {nationality}
            </Typography>
          )}
          {(position || preferredFoot) && (
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', fontSize: '0.7rem' }}
            >
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
          <Box
            sx={{ display: 'flex', justifyContent: 'space-around', mb: 0.5 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
              >
                {defence}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                DEF
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
              >
                {control}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                CTRL
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
              >
                {attack}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                ATT
              </Typography>
            </Box>
          </Box>

          {/* Rating */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                border: '2px solid white',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
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

export default PrintableCard;
