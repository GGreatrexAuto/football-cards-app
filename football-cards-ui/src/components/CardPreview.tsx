import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { useCard } from '../context/CardContext';
import type { ImageFrameType, ImageCropFocus } from '../context/CardContext';
import { getFlagUrl } from '../utils/flags';

const FRAME_STYLES: Record<
  ImageFrameType,
  { aspectRatio: string; borderRadius: string }
> = {
  face: { aspectRatio: '1 / 1', borderRadius: '50%' },
  headAndShoulders: { aspectRatio: '3 / 4', borderRadius: '8px' },
  fullBody: { aspectRatio: '2 / 3', borderRadius: '8px' },
};

const CROP_POSITION_MAP: Record<ImageCropFocus, string> = {
  top: 'top',
  centre: 'center',
  bottom: 'bottom',
};

const CardPreview: React.FC = () => {
  const { card, updateCard } = useCard();
  const {
    playerName,
    club,
    nationality,
    nationalityCode,
    nationalityDisplay,
    league,
    position,
    preferredFoot,
    defence,
    control,
    attack,
    rating,
    playerPhoto,
    cardBackground,
    textFonts,
    imageFrameType,
    imageCropFocus,
  } = card;

  const flagUrl = getFlagUrl(nationalityCode);

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
          {playerPhoto ? (
            <img
              data-testid="player-photo"
              src={playerPhoto}
              alt={`Player ${imageFrameType} photo, cropped from ${imageCropFocus}`}
              style={{
                aspectRatio: FRAME_STYLES[imageFrameType].aspectRatio,
                borderRadius: FRAME_STYLES[imageFrameType].borderRadius,
                objectFit: 'cover',
                objectPosition: CROP_POSITION_MAP[imageCropFocus],
                width: '100%',
                maxWidth: 120,
                border: '3px solid white',
                display: 'block',
              }}
            />
          ) : (
            <Avatar
              data-testid="player-photo"
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#fff',
                border: '3px solid white',
              }}
            >
              <Typography variant="h6" sx={{ color: '#1976D2' }}>
                {playerName ? playerName.charAt(0).toUpperCase() : '?'}
              </Typography>
            </Avatar>
          )}
        </Box>

        {/* Player Name */}
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          data-testid="player-name-text"
          sx={{
            fontFamily: textFonts.playerName,
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
            <Typography
              variant="body2"
              data-testid="club-text"
              sx={{
                fontFamily: textFonts.clubText,
                textAlign: 'center',
                mb: 0.5,
              }}
            >
              {club}
            </Typography>
          )}
          {nationality && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                mb: 0.5,
              }}
            >
              {(nationalityDisplay === 'flag' ||
                nationalityDisplay === 'both') &&
                flagUrl && (
                  <img
                    src={flagUrl}
                    alt={`${nationality} flag`}
                    data-testid="nationality-flag"
                    style={{ width: 24, height: 'auto' }}
                  />
                )}
              {(nationalityDisplay === 'text' ||
                nationalityDisplay === 'both' ||
                !flagUrl) && (
                <Typography
                  variant="body2"
                  data-testid="nationality-text"
                  sx={{ fontFamily: textFonts.countryText }}
                >
                  {nationality}
                </Typography>
              )}
            </Box>
          )}
          {league && (
            <Typography
              variant="body2"
              sx={{
                fontFamily: textFonts.clubText,
                textAlign: 'center',
                mb: 0.5,
              }}
            >
              {league}
            </Typography>
          )}
          {(position || preferredFoot) && (
            <Typography
              variant="body2"
              sx={{ fontFamily: textFonts.clubText, textAlign: 'center' }}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                data-testid="stat-value-defence"
                sx={{ fontFamily: textFonts.statsText, fontWeight: 'bold' }}
              >
                {defence}
              </Typography>
              <Typography
                variant="caption"
                data-testid="stat-label-def"
                sx={{ fontFamily: textFonts.statsText }}
              >
                DEF
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                data-testid="stat-value-control"
                sx={{ fontFamily: textFonts.statsText, fontWeight: 'bold' }}
              >
                {control}
              </Typography>
              <Typography
                variant="caption"
                data-testid="stat-label-ctrl"
                sx={{ fontFamily: textFonts.statsText }}
              >
                CTRL
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                data-testid="stat-value-attack"
                sx={{ fontFamily: textFonts.statsText, fontWeight: 'bold' }}
              >
                {attack}
              </Typography>
              <Typography
                variant="caption"
                data-testid="stat-label-att"
                sx={{ fontFamily: textFonts.statsText }}
              >
                ATT
              </Typography>
            </Box>
          </Box>

          {/* Rating */}
          <Box sx={{ textAlign: 'center', mt: 'auto' }}>
            <Typography
              variant="h4"
              component="div"
              data-testid="stat-value-rating"
              sx={{
                fontFamily: textFonts.statsText,
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
