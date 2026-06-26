import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Button,
  IconButton,
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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import Casino from '@mui/icons-material/Casino';
import {
  useCard,
  DEFAULT_TEXT_FONTS,
  DEFAULT_TEXT_COLORS,
} from '../context/CardContext';
import type {
  ImageFrameType,
  ImageCropFocus,
  NationalityDisplay,
  CardBorderShape,
  CardType,
  StatsStyle,
  CardLayout,
} from '../context/CardContext';
import { BORDER_SHAPE_LABELS } from './CardBorderShapes';
import CardBorderShapeIcon from './CardBorderShapeIcon';
import { getFlagUrl } from '../utils/flags';
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
  const [playerNameError, setPlayerNameError] = useState(false);
  const [useCustomClub, setUseCustomClub] = useState(false);
  const [customClubName, setCustomClubName] = useState('');
  const [useCustomLeague, setUseCustomLeague] = useState(false);
  const [customLeagueName, setCustomLeagueName] = useState('');
  const initialClub = useRef(card.club);
  const initialLeague = useRef(card.league);

  // Predefined background options
  const backgroundOptions = [
    {
      id: 'bg1',
      url: 'https://picsum.photos/300/200?random=1',
      name: 'Classic Green',
      description: 'Classic Green: green grass football pitch',
    },
    {
      id: 'bg2',
      url: 'https://picsum.photos/300/200?random=2',
      name: 'Stadium Blue',
      description: 'Stadium Blue: blue sky over a stadium',
    },
    {
      id: 'bg3',
      url: 'https://picsum.photos/300/200?random=3',
      name: 'Champions Gold',
      description: 'Champions Gold: golden confetti celebration',
    },
  ];

  // Default stock photos — human face portraits from randomuser.me
  const stockPhotos = [
    {
      id: 'stock1',
      url: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'Portrait of a male footballer, dark hair, looking forward',
    },
    {
      id: 'stock2',
      url: 'https://randomuser.me/api/portraits/women/44.jpg',
      name: 'Portrait of a female footballer, looking forward',
    },
    {
      id: 'stock3',
      url: 'https://randomuser.me/api/portraits/men/67.jpg',
      name: 'Portrait of a male footballer, short hair, side profile',
    },
    {
      id: 'stock4',
      url: 'https://randomuser.me/api/portraits/women/19.jpg',
      name: 'Portrait of a female footballer, short hair',
    },
    {
      id: 'stock5',
      url: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Portrait of a male footballer, beard, direct gaze',
    },
    {
      id: 'stock6',
      url: 'https://randomuser.me/api/portraits/women/58.jpg',
      name: 'Portrait of a female footballer, ponytail',
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
        if (
          initialLeague.current &&
          !leaguesData.find((l) => l.name === initialLeague.current)
        ) {
          setUseCustomLeague(true);
          setCustomLeagueName(initialLeague.current);
        }
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

  const randomStat = () => Math.floor(Math.random() * 101);

  const handleResetFields = () => {
    updateCard({
      playerName: '',
      club: '',
      nationality: '',
      nationalityCode: '',
      nationalityDisplay: 'text',
      league: '',
      position: '',
      preferredFoot: '',
      defence: 50,
      control: 50,
      attack: 50,
      rating: 50,
      statsStyle: 'adrenaline',
      speed: 50,
      tackle: 50,
      power: 50,
      shoot: 50,
      skill: 50,
      pass: 50,
    });
    setUseCustomClub(false);
    setCustomClubName('');
    setUseCustomLeague(false);
    setCustomLeagueName('');
    setValidationError('');
  };

  const handleRandomizeStats = () => {
    if (card.statsStyle === 'matchAtk') {
      updateCard({
        speed: randomStat(),
        tackle: randomStat(),
        power: randomStat(),
        shoot: randomStat(),
        skill: randomStat(),
        pass: randomStat(),
      });
    } else {
      updateCard({
        defence: randomStat(),
        control: randomStat(),
        attack: randomStat(),
      });
    }
  };

  const handleStatsStyleChange = (
    _: React.MouseEvent<HTMLElement>,
    newStyle: StatsStyle | null,
  ): void => {
    if (!newStyle || newStyle === card.statsStyle) return;
    if (newStyle === 'adrenaline') {
      updateCard({
        statsStyle: 'adrenaline',
        defence: 50,
        control: 50,
        attack: 50,
      });
    } else {
      updateCard({
        statsStyle: 'matchAtk',
        speed: 50,
        tackle: 50,
        power: 50,
        shoot: 50,
        skill: 50,
        pass: 50,
      });
    }
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
      setPlayerNameError(true);
      return;
    }

    const activeStatsInvalid =
      card.statsStyle === 'matchAtk'
        ? [
            card.speed,
            card.tackle,
            card.power,
            card.shoot,
            card.skill,
            card.pass,
          ].some((v) => v < 0 || v > 100)
        : [card.defence, card.control, card.attack].some(
            (v) => v < 0 || v > 100,
          );
    if (activeStatsInvalid) {
      setValidationError('Stats must be between 0 and 100.');
      return;
    }

    setPlayerNameError(false);
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

  const filteredClubs =
    card.league && !useCustomLeague
      ? clubs.filter((c) => c.league_name === card.league)
      : clubs;

  const defenceInvalid = card.defence < 0 || card.defence > 100;
  const controlInvalid = card.control < 0 || card.control > 100;
  const attackInvalid = card.attack < 0 || card.attack > 100;
  const speedInvalid = card.speed < 0 || card.speed > 100;
  const tackleInvalid = card.tackle < 0 || card.tackle > 100;
  const powerInvalid = card.power < 0 || card.power > 100;
  const shootInvalid = card.shoot < 0 || card.shoot > 100;
  const skillInvalid = card.skill < 0 || card.skill > 100;
  const passInvalid = card.pass < 0 || card.pass > 100;

  if (loading) {
    return (
      <Box role="status" aria-live="polite">
        <CircularProgress
          data-testid="form-loading"
          aria-label="Loading form options"
        />
        <Box
          component="span"
          sx={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
          }}
        >
          Loading form options…
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography role="alert" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Card Type Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Card Type
        </Typography>
        <Box component="fieldset" sx={{ border: 'none', p: 0, m: 0 }}>
          <Box
            component="legend"
            sx={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            Card type
          </Box>
          <ToggleButtonGroup
            value={card.cardType}
            exclusive
            onChange={(_, value: CardType | null) => {
              if (!value) return;
              updateCard({
                cardType: value,
                ...(value === 'national' ? { club: '', league: '' } : {}),
              });
              if (value === 'national') {
                setUseCustomClub(false);
                setCustomClubName('');
                setUseCustomLeague(false);
                setCustomLeagueName('');
              }
            }}
            aria-label="Card type"
            data-testid="card-type-selector"
            size="small"
          >
            <ToggleButton value="club" aria-label="Club card">
              Club
            </ToggleButton>
            <ToggleButton value="national" aria-label="National team card">
              National Team
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Player Info Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Player Info
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Player Name"
            fullWidth
            value={card.playerName}
            onChange={(e) => {
              updateCard({ playerName: e.target.value });
              if (playerNameError && e.target.value.trim()) {
                setPlayerNameError(false);
              }
            }}
            error={playerNameError}
            helperText={
              playerNameError ? 'Player name is required.' : undefined
            }
            slotProps={{
              formHelperText: { id: 'player-name-error' },
              htmlInput: {
                'data-testid': 'player-name',
                'aria-label': 'Player Name',
                'aria-required': 'true',
                'aria-invalid': playerNameError ? 'true' : 'false',
                'aria-describedby': playerNameError
                  ? 'player-name-error'
                  : undefined,
              },
            }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {card.cardType === 'club' && (
              <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                <FormControl fullWidth>
                  <InputLabel id="league-label">League</InputLabel>
                  <Select
                    labelId="league-label"
                    id="league-select"
                    data-testid="league-select"
                    aria-label="League"
                    value={useCustomLeague ? '__custom_league__' : card.league}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '__custom_league__') {
                        setUseCustomLeague(true);
                        updateCard({ league: customLeagueName });
                      } else {
                        setUseCustomLeague(false);
                        const currentClub = clubs.find(
                          (c) => c.name === card.club,
                        );
                        const clubBelongs =
                          !val ||
                          !currentClub ||
                          currentClub.league_name === val;
                        updateCard({
                          league: val,
                          ...(!clubBelongs ? { club: '' } : {}),
                        });
                      }
                    }}
                    label="League"
                  >
                    {leagues?.map((league) => (
                      <MenuItem key={league.id} value={league.name}>
                        {league.name}
                      </MenuItem>
                    ))}
                    {useCustomClub && (
                      <MenuItem value="__custom_league__">
                        Other — enter league name...
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
                {useCustomLeague && (
                  <TextField
                    label="Custom League Name"
                    fullWidth
                    value={customLeagueName}
                    onChange={(e) => {
                      setCustomLeagueName(e.target.value);
                      updateCard({ league: e.target.value });
                    }}
                    slotProps={{
                      htmlInput: {
                        'data-testid': 'custom-league-input',
                        'aria-label': 'Custom League Name',
                      },
                    }}
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            )}
            {card.cardType === 'club' && (
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
                        const chosenClub = clubs.find((c) => c.name === val);
                        setUseCustomLeague(false);
                        updateCard({
                          club: val,
                          ...(chosenClub?.league_name
                            ? { league: chosenClub.league_name }
                            : {}),
                        });
                      }
                    }}
                    label="Club"
                  >
                    {filteredClubs.map((club) => (
                      <MenuItem key={club.id} value={club.name}>
                        {club.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="__custom__">
                      Other — enter club name...
                    </MenuItem>
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
                    slotProps={{
                      htmlInput: {
                        'data-testid': 'custom-club-input',
                        'aria-label': 'Custom Club Name',
                      },
                    }}
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <FormControl fullWidth>
                <InputLabel id="nationality-label">Nationality</InputLabel>
                <Select
                  labelId="nationality-label"
                  id="nationality-select"
                  data-testid="nationality-select"
                  aria-label="Nationality"
                  value={card.nationality}
                  onChange={(e) => {
                    const name = e.target.value;
                    const selected = nationalities.find((n) => n.name === name);
                    const code = selected?.country_code ?? '';
                    const hasFlagUrl = Boolean(getFlagUrl(code));
                    const currentDisplay = card.nationalityDisplay;
                    const nextDisplay: NationalityDisplay =
                      !hasFlagUrl && currentDisplay !== 'text'
                        ? 'text'
                        : currentDisplay;
                    updateCard({
                      nationality: name,
                      nationalityCode: code,
                      nationalityDisplay: nextDisplay,
                    });
                  }}
                  label="Nationality"
                >
                  {nationalities?.map((nationality) => (
                    <MenuItem key={nationality.id} value={nationality.name}>
                      {nationality.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {card.nationality && (
                <fieldset
                  style={{ border: 'none', margin: '8px 0 0', padding: 0 }}
                >
                  <legend
                    style={{
                      fontSize: '0.75rem',
                      color: 'rgba(0,0,0,0.6)',
                      marginBottom: 4,
                    }}
                  >
                    Nationality display
                  </legend>
                  <ToggleButtonGroup
                    value={card.nationalityDisplay}
                    exclusive
                    onChange={(_, value: NationalityDisplay | null) => {
                      if (value) updateCard({ nationalityDisplay: value });
                    }}
                    aria-label="Nationality display mode"
                    data-testid="nationality-display-selector"
                    size="small"
                    fullWidth
                  >
                    <ToggleButton value="text" aria-label="Show text only">
                      Text
                    </ToggleButton>
                    <ToggleButton
                      value="flag"
                      aria-label="Show flag only"
                      disabled={!getFlagUrl(card.nationalityCode)}
                      title={
                        !getFlagUrl(card.nationalityCode)
                          ? 'Flag not available for this nationality'
                          : undefined
                      }
                    >
                      Flag
                    </ToggleButton>
                    <ToggleButton
                      value="both"
                      aria-label="Show flag and text"
                      disabled={!getFlagUrl(card.nationalityCode)}
                      title={
                        !getFlagUrl(card.nationalityCode)
                          ? 'Flag not available for this nationality'
                          : undefined
                      }
                    >
                      Both
                    </ToggleButton>
                  </ToggleButtonGroup>
                </fieldset>
              )}
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
                <InputLabel id="preferred-foot-label">
                  Preferred Foot
                </InputLabel>
                <Select
                  labelId="preferred-foot-label"
                  id="preferred-foot-select"
                  data-testid="preferred-foot-select"
                  aria-label="Preferred Foot"
                  value={card.preferredFoot}
                  onChange={(e) =>
                    updateCard({ preferredFoot: e.target.value })
                  }
                  label="Preferred Foot"
                >
                  <MenuItem value="Left">Left</MenuItem>
                  <MenuItem value="Right">Right</MenuItem>
                  <MenuItem value="Both">Both</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Tooltip title="Clears player details and stats — keeps photo, background and visual settings">
            <Button
              variant="outlined"
              onClick={handleResetFields}
              fullWidth
              data-testid="reset-fields"
              aria-label="Reset Fields"
            >
              Reset Fields
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Stats
        </Typography>
        <Box component="fieldset" sx={{ border: 'none', p: 0, m: 0 }}>
          <Box
            component="legend"
            sx={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            Player Stats
          </Box>

          {/* Stats Style Selector */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Stats Style
            </Typography>
            <ToggleButtonGroup
              value={card.statsStyle}
              exclusive
              onChange={handleStatsStyleChange}
              aria-label="Stats Style"
              data-testid="stats-style-selector"
              size="small"
              fullWidth
            >
              <ToggleButton value="adrenaline" aria-label="Adrenaline style">
                Adrenaline
              </ToggleButton>
              <ToggleButton value="matchAtk" aria-label="Match Atk style">
                Match Atk
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {card.statsStyle === 'adrenaline' ? (
            /* Adrenaline stats: Defence / Control / Attack */
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 100px', minWidth: '80px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TextField
                    label="Defence"
                    type="number"
                    fullWidth
                    value={card.defence}
                    onChange={(e) =>
                      updateCard({ defence: Number(e.target.value) })
                    }
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        max: 100,
                        'data-testid': 'defence-input',
                        'aria-label': 'Defence',
                        'aria-invalid': defenceInvalid ? 'true' : undefined,
                      },
                    }}
                  />
                  <Tooltip title="Randomise Defence">
                    <IconButton
                      size="small"
                      onClick={() => updateCard({ defence: randomStat() })}
                      data-testid="randomize-defence"
                      aria-label="Randomise Defence"
                    >
                      <Casino fontSize="small" aria-hidden="true" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 100px', minWidth: '80px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TextField
                    label="Control"
                    type="number"
                    fullWidth
                    value={card.control}
                    onChange={(e) =>
                      updateCard({ control: Number(e.target.value) })
                    }
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        max: 100,
                        'data-testid': 'control-input',
                        'aria-label': 'Control',
                        'aria-invalid': controlInvalid ? 'true' : undefined,
                      },
                    }}
                  />
                  <Tooltip title="Randomise Control">
                    <IconButton
                      size="small"
                      onClick={() => updateCard({ control: randomStat() })}
                      data-testid="randomize-control"
                      aria-label="Randomise Control"
                    >
                      <Casino fontSize="small" aria-hidden="true" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 100px', minWidth: '80px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TextField
                    label="Attack"
                    type="number"
                    fullWidth
                    value={card.attack}
                    onChange={(e) =>
                      updateCard({ attack: Number(e.target.value) })
                    }
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        max: 100,
                        'data-testid': 'attack-input',
                        'aria-label': 'Attack',
                        'aria-invalid': attackInvalid ? 'true' : undefined,
                      },
                    }}
                  />
                  <Tooltip title="Randomise Attack">
                    <IconButton
                      size="small"
                      onClick={() => updateCard({ attack: randomStat() })}
                      data-testid="randomize-attack"
                      aria-label="Randomise Attack"
                    >
                      <Casino fontSize="small" aria-hidden="true" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ) : (
            /* Match Atk stats: Speed / Tackle / Power / Shoot / Skill / Pass */
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {(
                [
                  {
                    label: 'Speed',
                    field: 'speed',
                    value: card.speed,
                    invalid: speedInvalid,
                    testId: 'speed-input',
                    randomId: 'randomize-speed',
                  },
                  {
                    label: 'Tackle',
                    field: 'tackle',
                    value: card.tackle,
                    invalid: tackleInvalid,
                    testId: 'tackle-input',
                    randomId: 'randomize-tackle',
                  },
                  {
                    label: 'Power',
                    field: 'power',
                    value: card.power,
                    invalid: powerInvalid,
                    testId: 'power-input',
                    randomId: 'randomize-power',
                  },
                  {
                    label: 'Shoot',
                    field: 'shoot',
                    value: card.shoot,
                    invalid: shootInvalid,
                    testId: 'shoot-input',
                    randomId: 'randomize-shoot',
                  },
                  {
                    label: 'Skill',
                    field: 'skill',
                    value: card.skill,
                    invalid: skillInvalid,
                    testId: 'skill-input',
                    randomId: 'randomize-skill',
                  },
                  {
                    label: 'Pass',
                    field: 'pass',
                    value: card.pass,
                    invalid: passInvalid,
                    testId: 'pass-input',
                    randomId: 'randomize-pass',
                  },
                ] as const
              ).map(({ label, field, value, invalid, testId, randomId }) => (
                <Box key={field} sx={{ flex: '1 1 100px', minWidth: '80px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TextField
                      label={label}
                      type="number"
                      fullWidth
                      value={value}
                      onChange={(e) =>
                        updateCard({ [field]: Number(e.target.value) })
                      }
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          max: 100,
                          'data-testid': testId,
                          'aria-label': label,
                          'aria-invalid': invalid ? 'true' : undefined,
                        },
                      }}
                    />
                    <Tooltip title={`Randomise ${label}`}>
                      <IconButton
                        size="small"
                        onClick={() => updateCard({ [field]: randomStat() })}
                        data-testid={randomId}
                        aria-label={`Randomise ${label}`}
                      >
                        <Casino fontSize="small" aria-hidden="true" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Button
          variant="contained"
          onClick={handleRandomizeStats}
          fullWidth
          data-testid="randomize-stats"
          aria-label="Randomize Stats"
          sx={{ mt: 2 }}
        >
          🎲 Randomize Stats
        </Button>
      </Box>

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
            slotProps={{
              htmlInput: {
                'data-testid': 'photo-url',
                'aria-label': 'Photo URL',
              },
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
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => updateCard({ playerPhoto: null })}
            disabled={card.playerPhoto === null}
            data-testid="reset-player-photo"
            aria-label="Reset Player Photo"
          >
            Reset Photo
          </Button>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="subtitle2" id="image-frame-type-label">
            Frame type:
          </Typography>
          <ToggleButtonGroup
            value={card.imageFrameType}
            exclusive
            onChange={(_, value: ImageFrameType | null) => {
              if (value) updateCard({ imageFrameType: value });
            }}
            aria-label="Player image frame type"
            data-testid="image-frame-type-selector"
            size="small"
            fullWidth
          >
            <ToggleButton value="face" aria-label="Face">
              Face
            </ToggleButton>
            <ToggleButton
              value="headAndShoulders"
              aria-label="Head & Shoulders"
            >
              Head &amp; Shoulders
            </ToggleButton>
            <ToggleButton value="fullBody" aria-label="Full Body">
              Full Body
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="subtitle2" id="image-crop-focus-label">
            Crop focus:
          </Typography>
          <ToggleButtonGroup
            value={card.imageCropFocus}
            exclusive
            onChange={(_, value: ImageCropFocus | null) => {
              if (value) updateCard({ imageCropFocus: value });
            }}
            aria-label="Image crop focus"
            data-testid="image-crop-focus-selector"
            size="small"
            fullWidth
          >
            <ToggleButton value="top" aria-label="Top">
              Top
            </ToggleButton>
            <ToggleButton value="centre" aria-label="Centre">
              Centre
            </ToggleButton>
            <ToggleButton value="bottom" aria-label="Bottom">
              Bottom
            </ToggleButton>
          </ToggleButtonGroup>
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
                  alt={bg.description}
                />
                <Typography
                  variant="caption"
                  align="center"
                  sx={{ display: 'block' }}
                >
                  {bg.name}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => updateCard({ cardBackground: null })}
            disabled={card.cardBackground === null}
            data-testid="reset-card-background"
            aria-label="Reset Card Background"
          >
            Reset Background
          </Button>
        </Box>
      </Box>

      {/* Card Border Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Card Border
        </Typography>
        <Box component="fieldset" sx={{ border: 'none', p: 0, m: 0 }}>
          <Box
            component="legend"
            sx={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            Card border options
          </Box>
          <Typography variant="subtitle2" gutterBottom>
            Border Shape
          </Typography>
          <ToggleButtonGroup
            value={card.cardBorderShape}
            exclusive
            onChange={(_: React.MouseEvent, value: CardBorderShape | null) => {
              if (value !== null) updateCard({ cardBorderShape: value });
            }}
            aria-label="Card border shape"
            data-testid="card-border-shape-selector"
            size="small"
            fullWidth
          >
            {(
              [
                'none',
                'rectangle',
                'shield',
                'triangle',
                'explosion',
              ] as CardBorderShape[]
            ).map((shape) => (
              <ToggleButton
                key={shape}
                value={shape}
                aria-label={`${BORDER_SHAPE_LABELS[shape]} border`}
                sx={{ flexDirection: 'column', gap: 0.25, py: 0.75 }}
              >
                <CardBorderShapeIcon shape={shape} size={18} />
                <Box
                  component="span"
                  sx={{ fontSize: '0.6rem', lineHeight: 1 }}
                >
                  {BORDER_SHAPE_LABELS[shape]}
                </Box>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          {card.cardBorderShape !== 'none' && (
            <Box
              sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}
            >
              <Typography variant="subtitle2" id="border-color-label">
                Border Colour
              </Typography>
              <Box
                component="input"
                type="color"
                id="card-border-color"
                aria-label="Card border colour"
                aria-labelledby="border-color-label"
                value={card.cardBorderColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateCard({ cardBorderColor: e.target.value })
                }
                data-testid="card-border-color-picker"
                sx={{
                  width: 48,
                  height: 32,
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  padding: '2px',
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Card Layout Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Card Layout
        </Typography>
        <Box
          component="fieldset"
          sx={{ border: 'none', p: 0, m: 0, position: 'relative' }}
        >
          <Box
            component="legend"
            sx={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            Card layout
          </Box>
          <ToggleButtonGroup
            value={card.cardLayout}
            exclusive
            onChange={(_: React.MouseEvent, value: CardLayout | null) => {
              if (value !== null) updateCard({ cardLayout: value });
            }}
            aria-label="Card layout"
            data-testid="card-layout-selector"
            size="small"
            fullWidth
          >
            <ToggleButton value="default" aria-label="Default layout">
              Default
            </ToggleButton>
            <ToggleButton value="statsBottom" aria-label="Stats bottom layout">
              Stats Bottom
            </ToggleButton>
            <ToggleButton value="largePhoto" aria-label="Large photo layout">
              Large Photo
            </ToggleButton>
            <ToggleButton value="mediumPhoto" aria-label="Medium photo layout">
              Medium Photo
            </ToggleButton>
            <ToggleButton value="smallPhoto" aria-label="Small photo layout">
              Small Photo
            </ToggleButton>
          </ToggleButtonGroup>
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

      {/* Text Colours Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Text Colours
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {(
            [
              {
                field: 'playerName',
                label: 'Player Name',
                testId: 'player-name',
              },
              {
                field: 'clubText',
                label: 'Club / League / Position',
                testId: 'club-text',
              },
              {
                field: 'countryText',
                label: 'Nationality',
                testId: 'country-text',
              },
              { field: 'statsText', label: 'Stats', testId: 'stats-text' },
            ] as const
          ).map(({ field, label, testId }) => (
            <Box
              key={field}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
            >
              <Typography
                variant="subtitle2"
                aria-hidden="true"
                sx={{ flex: 1 }}
              >
                {label}
              </Typography>
              <Box
                component="input"
                type="color"
                aria-label={`${label} text colour`}
                value={card.textColors[field]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateCard({
                    textColors: { ...card.textColors, [field]: e.target.value },
                  })
                }
                data-testid={`text-color-picker-${testId}`}
                sx={{
                  width: 48,
                  height: 32,
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  padding: '2px',
                }}
              />
            </Box>
          ))}
          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              updateCard({ textColors: { ...DEFAULT_TEXT_COLORS } })
            }
            data-testid="reset-text-colors"
            aria-label="Reset Text Colours"
            sx={{ mt: 0.5 }}
          >
            Reset Text Colours
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
            setUseCustomClub(false);
            setCustomClubName('');
            setUseCustomLeague(false);
            setCustomLeagueName('');
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
          role="alert"
          aria-live="assertive"
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
          role="alert"
          aria-live="assertive"
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
