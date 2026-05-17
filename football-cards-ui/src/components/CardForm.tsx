import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardMedia,
  Snackbar,
  Alert,
} from '@mui/material';
import { useCard } from '../context/CardContext';
import { DEFAULT_TEXT_FONTS } from '../context/CardContext';
import FontSelector from './FontSelector';
import {
  getClubs,
  getNationalities,
  getLeagues,
  getPositions,
  Club,
  Nationality,
  League,
  Position,
} from '../services/api';
import { saveCard, updateCard as updateSavedCard } from '../services/storage';

const CardForm: React.FC = () => {
  const { card, updateCard, resetCard } = useCard();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  const [useCustomClub, setUseCustomClub] = useState(false);
  const [customClubName, setCustomClubName] = useState('');
  const initialClub = useRef(card.club);

  // Predefined background options
  const backgroundOptions = [
    {
      id: 'bg1',
      url: 'https://picsum.photos/300/200?random=1',
      name: 'Classic Green',
    },
    {
      id: 'bg2',
      url: 'https://picsum.photos/300/200?random=2',
      name: 'Stadium Blue',
    },
    {
      id: 'bg3',
      url: 'https://picsum.photos/300/200?random=3',
      name: 'Champions Gold',
    },
  ];

  // Default stock photos — human face portraits from randomuser.me
  const stockPhotos = [
    {
      id: 'stock1',
      url: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'Player Portrait 1',
    },
    {
      id: 'stock2',
      url: 'https://randomuser.me/api/portraits/women/44.jpg',
      name: 'Player Portrait 2',
    },
    {
      id: 'stock3',
      url: 'https://randomuser.me/api/portraits/men/67.jpg',
      name: 'Player Portrait 3',
    },
    {
      id: 'stock4',
      url: 'https://randomuser.me/api/portraits/women/19.jpg',
      name: 'Player Portrait 4',
    },
    {
      id: 'stock5',
      url: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Player Portrait 5',
    },
    {
      id: 'stock6',
      url: 'https://randomuser.me/api/portraits/women/58.jpg',
      name: 'Player Portrait 6',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clubsData, nationalitiesData, leaguesData, positionsData] =
          await Promise.all([
            getClubs(),
            getNationalities(),
            getLeagues(),
            getPositions(),
          ]);
        const sortedClubs = [...clubsData].sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        setClubs(sortedClubs);
        if (
          initialClub.current &&
          !sortedClubs.find((c) => c.name === initialClub.current)
        ) {
          setUseCustomClub(true);
          setCustomClubName(initialClub.current);
        }
        setNationalities(nationalitiesData);
        setLeagues(leaguesData);
        setPositions(positionsData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Failed to fetch data:', err);
        setError(
          `Failed to fetch data: ${errorMessage}. Please ensure the backend API is running on http://localhost:8000`,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRandomizeStats = () => {
    const randomStat = () => Math.floor(Math.random() * 101);
    updateCard({
      defence: randomStat(),
      control: randomStat(),
      attack: randomStat(),
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateCard({ playerPhoto: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateImageUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) return false;
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(parsed.pathname);
    } catch {
      return false;
    }
  };

  const handleUrlInput = () => {
    if (!photoUrl) {
      setValidationError('Please enter an image URL.');
      return;
    }

    if (!validateImageUrl(photoUrl)) {
      setValidationError(
        'Invalid image URL. Use http/https and standard image extension.',
      );
      return;
    }

    setValidationError('');
    updateCard({ playerPhoto: photoUrl });
  };

  const handleSaveCard = () => {
    if (!card.playerName.trim()) {
      setValidationError('Player name is required.');
      return;
    }

    if (
      card.defence < 0 ||
      card.defence > 100 ||
      card.control < 0 ||
      card.control > 100 ||
      card.attack < 0 ||
      card.attack > 100
    ) {
      setValidationError('Stats must be between 0 and 100.');
      return;
    }

    setValidationError('');

    if (card.cardId) {
      updateSavedCard(card.cardId, card);
      setSuccessMessage('Card updated successfully!');
    } else {
      saveCard(card);
      setSuccessMessage('Card saved successfully!');
    }

    resetCard();
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        label="Player Name"
        fullWidth
        value={card.playerName}
        onChange={(e) => updateCard({ playerName: e.target.value })}
        inputProps={{
          'data-testid': 'player-name',
          'aria-label': 'Player Name',
        }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <FormControl fullWidth>
            <InputLabel id="club-label">Club</InputLabel>
            <Select
              labelId="club-label"
              id="club-select"
              data-testid="club-select"
              aria-label="Club"
              value={useCustomClub ? '__custom__' : card.club}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '__custom__') {
                  setUseCustomClub(true);
                  updateCard({ club: customClubName });
                } else {
                  setUseCustomClub(false);
                  updateCard({ club: val });
                }
              }}
              label="Club"
            >
              {clubs?.map((club) => (
                <MenuItem key={club.id} value={club.name}>
                  {club.name}
                </MenuItem>
              ))}
              <MenuItem value="__custom__">Other — enter club name...</MenuItem>
            </Select>
          </FormControl>
          {useCustomClub && (
            <TextField
              label="Custom Club Name"
              fullWidth
              value={customClubName}
              onChange={(e) => {
                setCustomClubName(e.target.value);
                updateCard({ club: e.target.value });
              }}
              inputProps={{
                'data-testid': 'custom-club-input',
                'aria-label': 'Custom Club Name',
              }}
              sx={{ mt: 1 }}
            />
          )}
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <FormControl fullWidth>
            <InputLabel id="nationality-label">Nationality</InputLabel>
            <Select
              labelId="nationality-label"
              id="nationality-select"
              data-testid="nationality-select"
              aria-label="Nationality"
              value={card.nationality}
              onChange={(e) => updateCard({ nationality: e.target.value })}
              label="Nationality"
            >
              {nationalities?.map((nationality) => (
                <MenuItem key={nationality.id} value={nationality.name}>
                  {nationality.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <FormControl fullWidth>
            <InputLabel id="league-label">League</InputLabel>
            <Select
              labelId="league-label"
              id="league-select"
              data-testid="league-select"
              aria-label="League"
              value={card.league}
              onChange={(e) => updateCard({ league: e.target.value })}
              label="League"
            >
              {leagues?.map((league) => (
                <MenuItem key={league.id} value={league.name}>
                  {league.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <FormControl fullWidth>
            <InputLabel id="position-label">Position</InputLabel>
            <Select
              labelId="position-label"
              id="position-select"
              data-testid="position-select"
              aria-label="Position"
              value={card.position}
              onChange={(e) => updateCard({ position: e.target.value })}
              label="Position"
            >
              {positions.map((pos) => (
                <MenuItem key={pos.code} value={pos.code}>
                  {pos.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <FormControl fullWidth>
            <InputLabel id="preferred-foot-label">Preferred Foot</InputLabel>
            <Select
              labelId="preferred-foot-label"
              id="preferred-foot-select"
              data-testid="preferred-foot-select"
              aria-label="Preferred Foot"
              value={card.preferredFoot}
              onChange={(e) => updateCard({ preferredFoot: e.target.value })}
              label="Preferred Foot"
            >
              <MenuItem value="Left">Left</MenuItem>
              <MenuItem value="Right">Right</MenuItem>
              <MenuItem value="Both">Both</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: '1 1 100px', minWidth: '80px' }}>
          <TextField
            label="Defence"
            type="number"
            fullWidth
            value={card.defence}
            onChange={(e) => updateCard({ defence: Number(e.target.value) })}
            inputProps={{
              min: 0,
              max: 100,
              'data-testid': 'defence-input',
              'aria-label': 'Defence',
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 100px', minWidth: '80px' }}>
          <TextField
            label="Control"
            type="number"
            fullWidth
            value={card.control}
            onChange={(e) => updateCard({ control: Number(e.target.value) })}
            inputProps={{
              min: 0,
              max: 100,
              'data-testid': 'control-input',
              'aria-label': 'Control',
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 100px', minWidth: '80px' }}>
          <TextField
            label="Attack"
            type="number"
            fullWidth
            value={card.attack}
            onChange={(e) => updateCard({ attack: Number(e.target.value) })}
            inputProps={{
              min: 0,
              max: 100,
              'data-testid': 'attack-input',
              'aria-label': 'Attack',
            }}
          />
        </Box>
      </Box>
      <Button
        variant="contained"
        onClick={handleRandomizeStats}
        fullWidth
        data-testid="randomize-stats"
        aria-label="Randomize Stats"
      >
        🎲 Randomize Stats
      </Button>

      {/* Player Photo Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Player Photo
        </Typography>
        <Box sx={{ mb: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="photo-upload"
            data-testid="photo-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="photo-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              aria-label="Upload Photo"
            >
              Upload Photo
            </Button>
          </label>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            label="Photo URL"
            fullWidth
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            inputProps={{
              'data-testid': 'photo-url',
              'aria-label': 'Photo URL',
            }}
          />
          <Button
            variant="outlined"
            onClick={handleUrlInput}
            data-testid="set-url"
            aria-label="Set Photo URL"
          >
            Set URL
          </Button>
        </Box>
        <Typography variant="subtitle2" gutterBottom id="stock-photos-label">
          Or select a player portrait:
        </Typography>
        <Box
          data-testid="stock-photos"
          role="group"
          aria-labelledby="stock-photos-label"
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
        >
          {stockPhotos.map((photo) => (
            <Box key={photo.id} sx={{ flex: '0 0 30%', minWidth: '80px' }}>
              <Card
                role="button"
                tabIndex={0}
                aria-label={photo.name}
                aria-pressed={card.playerPhoto === photo.url}
                sx={{
                  cursor: 'pointer',
                  border:
                    card.playerPhoto === photo.url
                      ? '2px solid #1976D2'
                      : '1px solid #ccc',
                }}
                onClick={() => updateCard({ playerPhoto: photo.url })}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    updateCard({ playerPhoto: photo.url });
                  }
                }}
                data-testid={`stock-photo-${photo.id}`}
              >
                <CardMedia
                  component="img"
                  height="60"
                  image={photo.url}
                  alt={photo.name}
                />
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Card Background Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Card Background
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {backgroundOptions.map((bg) => (
            <Box key={bg.id} sx={{ flex: '0 0 30%', minWidth: '80px' }}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border:
                    card.cardBackground === bg.url
                      ? '2px solid #1976D2'
                      : '1px solid #ccc',
                }}
                onClick={() => updateCard({ cardBackground: bg.url })}
                data-testid={`background-${bg.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardMedia
                  component="img"
                  height="60"
                  image={bg.url}
                  alt={bg.name}
                />
                <Typography variant="caption" align="center" display="block">
                  {bg.name}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Text Customisation Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Text Customisation
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FontSelector
            label="Player Name Font"
            value={card.textFonts.playerName}
            onChange={(font) =>
              updateCard({ textFonts: { ...card.textFonts, playerName: font } })
            }
            previewText={card.playerName || 'Player Name'}
          />
          <FontSelector
            label="Club / League / Position Font"
            value={card.textFonts.clubText}
            onChange={(font) =>
              updateCard({ textFonts: { ...card.textFonts, clubText: font } })
            }
            previewText={card.club || 'Club Name'}
          />
          <FontSelector
            label="Nationality Font"
            value={card.textFonts.countryText}
            onChange={(font) =>
              updateCard({
                textFonts: { ...card.textFonts, countryText: font },
              })
            }
            previewText={card.nationality || 'Nationality'}
          />
          <FontSelector
            label="Stats Font"
            value={card.textFonts.statsText}
            onChange={(font) =>
              updateCard({ textFonts: { ...card.textFonts, statsText: font } })
            }
            previewText="80 DEF  75 CTRL  90 ATT"
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => updateCard({ textFonts: { ...DEFAULT_TEXT_FONTS } })}
            data-testid="reset-text-fonts"
            aria-label="Reset Text Fonts"
          >
            Reset Text Fonts
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSaveCard}
          fullWidth
          data-testid="save-card"
          aria-label="Save Card"
        >
          Save Card
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          onClick={() => {
            resetCard();
            setPhotoUrl('');
            setValidationError('');
            setSuccessMessage('');
          }}
          fullWidth
          data-testid="reset-form"
          aria-label="Reset Form"
        >
          Reset Form
        </Button>
      </Box>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert
          severity="success"
          onClose={() => setSuccessMessage('')}
          data-testid="success-message"
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(validationError)}
        autoHideDuration={4000}
        onClose={() => setValidationError('')}
      >
        <Alert
          severity="error"
          onClose={() => setValidationError('')}
          data-testid="error-message"
        >
          {validationError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CardForm;
