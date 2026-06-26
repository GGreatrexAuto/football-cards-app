import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { useCard, CardState } from '../context/CardContext';
import type { CardLayout } from '../context/CardContext';
import { getFlagUrl } from '../utils/flags';
import { BORDER_SHAPE_PATHS } from './CardBorderShapes';

interface PrintableCardProps {
  cardData?: CardState;
}

const PrintableCard: React.FC<PrintableCardProps> = ({ cardData }) => {
  const { card: contextCard } = useCard();
  const card = cardData ?? contextCard;
  const {
    playerName,
    club,
    nationality,
    nationalityCode,
    nationalityDisplay,
    position,
    preferredFoot,
    defence,
    control,
    attack,
    rating,
    statsStyle,
    speed,
    tackle,
    power,
    shoot,
    skill,
    pass,
    playerPhoto,
    cardBackground,
    textFonts,
    textColors,
    cardBorderShape,
    cardBorderColor,
    cardLayout,
  } = card;

  const photoSize: Record<CardLayout, number> = {
    largePhoto: 80,
    mediumPhoto: 50,
    default: 50,
    statsBottom: 50,
    smallPhoto: 30,
  };

  const flagUrl = getFlagUrl(nationalityCode);

  const cardStyle = {
    width: '3.5in',
    height: '2.5in',
    position: 'relative' as const,
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
  };

  return (
    <Card
      className="printable-card"
      data-testid="printable-card"
      sx={cardStyle}
    >
      {cardBorderShape !== 'none' && (
        <Box
          component="svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          data-testid="card-border-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <path
            d={BORDER_SHAPE_PATHS[cardBorderShape]}
            fill="none"
            stroke={cardBorderColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </Box>
      )}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 1,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Player Photo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
          <Avatar
            src={playerPhoto || undefined}
            data-testid="printable-card-avatar"
            data-photo-size={photoSize[cardLayout]}
            sx={{
              width: photoSize[cardLayout],
              height: photoSize[cardLayout],
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
          data-testid="player-name-text"
          sx={{
            fontFamily: textFonts.playerName,
            color: textColors.playerName,
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
        <Box sx={{ mb: 0.5, ...(cardLayout === 'statsBottom' && { flex: 1 }) }}>
          {club && (
            <Typography
              variant="body2"
              sx={{
                fontFamily: textFonts.clubText,
                color: textColors.clubText,
                textAlign: 'center',
                fontSize: '0.7rem',
                mb: 0.2,
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
                mb: 0.2,
              }}
            >
              {(nationalityDisplay === 'flag' ||
                nationalityDisplay === 'both') &&
                flagUrl && (
                  <img
                    src={flagUrl}
                    alt={`${nationality} flag`}
                    data-testid="nationality-flag"
                    style={{ width: 18, height: 'auto' }}
                  />
                )}
              {(nationalityDisplay === 'text' ||
                nationalityDisplay === 'both' ||
                !flagUrl) && (
                <Typography
                  variant="body2"
                  data-testid="nationality-text"
                  sx={{
                    fontFamily: textFonts.countryText,
                    color: textColors.countryText,
                    fontSize: '0.7rem',
                  }}
                >
                  {nationality}
                </Typography>
              )}
            </Box>
          )}
          {(position || preferredFoot) && (
            <Typography
              variant="body2"
              sx={{
                fontFamily: textFonts.clubText,
                color: textColors.clubText,
                textAlign: 'center',
                fontSize: '0.7rem',
              }}
            >
              {position} {preferredFoot && `(${preferredFoot})`}
            </Typography>
          )}
        </Box>

        {/* Stats + Rating — order swapped for statsBottom layout */}
        {cardLayout === 'statsBottom' ? (
          <>
            {/* Rating appears above stats in statsBottom */}
            <Box
              sx={{ textAlign: 'center', mb: 0.5 }}
              data-testid="rating-section"
            >
              <Typography
                variant="h4"
                component="div"
                data-testid="stat-value-rating"
                sx={{
                  fontFamily: textFonts.statsText,
                  color: textColors.statsText,
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
            <Box data-testid="stats-section">
              {statsStyle === 'adrenaline' ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    mb: 0.5,
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: textFonts.statsText,
                        color: textColors.statsText,
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      {defence}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: textFonts.statsText,
                        color: textColors.statsText,
                        fontSize: '0.6rem',
                      }}
                    >
                      DEF
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: textFonts.statsText,
                        color: textColors.statsText,
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      {control}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: textFonts.statsText,
                        color: textColors.statsText,
                        fontSize: '0.6rem',
                      }}
                    >
                      CTRL
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: textFonts.statsText,
                        color: textColors.statsText,
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      {attack}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: textFonts.statsText,
                        color: textColors.statsText,
                        fontSize: '0.6rem',
                      }}
                    >
                      ATT
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    mb: 0.5,
                  }}
                >
                  {(
                    [
                      { label: 'SPD', value: speed },
                      { label: 'TAC', value: tackle },
                      { label: 'PWR', value: power },
                      { label: 'SHT', value: shoot },
                      { label: 'SKL', value: skill },
                      { label: 'PAS', value: pass },
                    ] as const
                  ).map(({ label, value }) => (
                    <Box
                      key={label}
                      sx={{ textAlign: 'center', width: '30%', mb: 0.25 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: textFonts.statsText,
                          color: textColors.statsText,
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                        }}
                      >
                        {value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: textFonts.statsText,
                          color: textColors.statsText,
                          fontSize: '0.55rem',
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </>
        ) : (
          /* Default / photo-size layouts: stats above rating */
          <Box
            data-testid="stats-section"
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {statsStyle === 'adrenaline' ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  mb: 0.5,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: textFonts.statsText,
                      color: textColors.statsText,
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    {defence}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: textFonts.statsText,
                      color: textColors.statsText,
                      fontSize: '0.6rem',
                    }}
                  >
                    DEF
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: textFonts.statsText,
                      color: textColors.statsText,
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    {control}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: textFonts.statsText,
                      color: textColors.statsText,
                      fontSize: '0.6rem',
                    }}
                  >
                    CTRL
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: textFonts.statsText,
                      color: textColors.statsText,
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    {attack}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: textFonts.statsText,
                      color: textColors.statsText,
                      fontSize: '0.6rem',
                    }}
                  >
                    ATT
                  </Typography>
                </Box>
              </Box>
            ) : (
              /* Match Atk: 6 stats in 2 rows of 3 */
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-around',
                  mb: 0.5,
                }}
              >
                {(
                  [
                    { label: 'SPD', value: speed },
                    { label: 'TAC', value: tackle },
                    { label: 'PWR', value: power },
                    { label: 'SHT', value: shoot },
                    { label: 'SKL', value: skill },
                    { label: 'PAS', value: pass },
                  ] as const
                ).map(({ label, value }) => (
                  <Box
                    key={label}
                    sx={{ textAlign: 'center', width: '30%', mb: 0.25 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: textFonts.statsText,
                        color: textColors.statsText,
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                      }}
                    >
                      {value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: textFonts.statsText,
                        color: textColors.statsText,
                        fontSize: '0.55rem',
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Rating */}
            <Box sx={{ textAlign: 'center' }} data-testid="rating-section">
              <Typography
                variant="h4"
                component="div"
                data-testid="stat-value-rating"
                sx={{
                  fontFamily: textFonts.statsText,
                  color: textColors.statsText,
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
        )}
      </CardContent>
    </Card>
  );
};

export default PrintableCard;
