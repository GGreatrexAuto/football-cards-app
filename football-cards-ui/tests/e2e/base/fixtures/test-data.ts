/**
 * Test data fixtures for E2E tests
 */

// Sample player data
export const SAMPLE_PLAYERS = {
  CRISTIANO_RONALDO: {
    name: 'Cristiano Ronaldo',
    club: 'Real Madrid',
    nationality: 'Portugal',
    league: 'La Liga',
    position: 'Forward',
    stats: { defence: 45, control: 88, attack: 95 },
  },
  LIONEL_MESSI: {
    name: 'Lionel Messi',
    club: 'Barcelona',
    nationality: 'Argentina',
    league: 'La Liga',
    position: 'Forward',
    stats: { defence: 35, control: 92, attack: 94 },
  },
  TEST_PLAYER: {
    name: 'Test Player',
    club: 'Arsenal',
    nationality: 'England',
    league: 'Premier League',
    position: 'Midfielder',
    stats: { defence: 75, control: 80, attack: 70 },
  },
};

// Sample clubs data
export const SAMPLE_CLUBS = [
  'Real Madrid',
  'Barcelona',
  'Atletico Madrid',
  'Sevilla',
  'Valencia',
  'Manchester United',
  'Liverpool',
  'Manchester City',
  'Chelsea',
  'Arsenal',
  'Bayern Munich',
  'Borussia Dortmund',
  'RB Leipzig',
  'Bayer Leverkusen',
  'Eintracht Frankfurt',
  'Juventus',
  'AC Milan',
  'Inter Milan',
  'Napoli',
  'Roma',
];

// Sample nationalities
export const SAMPLE_NATIONALITIES = [
  'Spain',
  'Brazil',
  'Argentina',
  'France',
  'Germany',
  'Italy',
  'England',
  'Portugal',
  'Netherlands',
  'Uruguay',
];

// Sample leagues
export const SAMPLE_LEAGUES = [
  'La Liga',
  'Premier League',
  'Bundesliga',
  'Serie A',
];

// Sample positions
export const SAMPLE_POSITIONS = [
  'Goalkeeper',
  'Defender',
  'Midfielder',
  'Forward',
];

// Background options
export const SAMPLE_BACKGROUNDS = [
  'Classic Green',
  'Royal Blue',
  'Crimson Red',
  'Golden Yellow',
  'Dark Purple',
];

/**
 * Generate random card data
 */
export function generateRandomCardData(
  overrides: Partial<typeof SAMPLE_PLAYERS.TEST_PLAYER> = {},
) {
  const randomClub =
    SAMPLE_CLUBS[Math.floor(Math.random() * SAMPLE_CLUBS.length)];
  const randomNationality =
    SAMPLE_NATIONALITIES[
      Math.floor(Math.random() * SAMPLE_NATIONALITIES.length)
    ];
  const randomLeague =
    SAMPLE_LEAGUES[Math.floor(Math.random() * SAMPLE_LEAGUES.length)];
  const randomPosition =
    SAMPLE_POSITIONS[Math.floor(Math.random() * SAMPLE_POSITIONS.length)];

  const defence = Math.floor(Math.random() * 100) + 1;
  const control = Math.floor(Math.random() * 100) + 1;
  const attack = Math.floor(Math.random() * 100) + 1;
  return {
    name: `Test Player ${Math.floor(Math.random() * 1000)}`,
    club: randomClub,
    nationality: randomNationality,
    league: randomLeague,
    position: randomPosition,
    stats: { defence, control, attack },
    rating: Math.round((defence + control + attack) / 3),
    ...overrides,
  };
}

/**
 * Generate multiple random cards
 */
export function generateMultipleCards(
  count: number,
): (typeof SAMPLE_PLAYERS.TEST_PLAYER)[] {
  return Array.from({ length: count }, () => generateRandomCardData());
}

/**
 * Card data builder for fluent test data creation
 */
export class CardDataBuilder {
  private data: typeof SAMPLE_PLAYERS.TEST_PLAYER;

  constructor(
    baseData: typeof SAMPLE_PLAYERS.TEST_PLAYER = SAMPLE_PLAYERS.TEST_PLAYER,
  ) {
    this.data = { ...baseData };
  }

  withName(name: string): CardDataBuilder {
    this.data.name = name;
    return this;
  }

  withClub(club: string): CardDataBuilder {
    this.data.club = club;
    return this;
  }

  withNationality(nationality: string): CardDataBuilder {
    this.data.nationality = nationality;
    return this;
  }

  withLeague(league: string): CardDataBuilder {
    this.data.league = league;
    return this;
  }

  withPosition(position: string): CardDataBuilder {
    this.data.position = position;
    return this;
  }

  withStats(stats: {
    defence: number;
    control: number;
    attack: number;
  }): CardDataBuilder {
    this.data.stats = { ...stats };
    return this;
  }

  withRandomStats(): CardDataBuilder {
    this.data.stats = {
      defence: Math.floor(Math.random() * 100) + 1,
      control: Math.floor(Math.random() * 100) + 1,
      attack: Math.floor(Math.random() * 100) + 1,
    };
    return this;
  }

  build(): typeof SAMPLE_PLAYERS.TEST_PLAYER {
    return { ...this.data };
  }
}
