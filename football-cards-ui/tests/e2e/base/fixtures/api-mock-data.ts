/**
 * Mock API response data for E2E tests
 */

// Mock API responses matching the backend contract
export const MOCK_API_RESPONSES = {
  CLUBS: [
    { id: 1, name: 'Arsenal' },
    { id: 2, name: 'Chelsea' },
    { id: 3, name: 'Liverpool' },
    { id: 4, name: 'Manchester City' },
    { id: 5, name: 'Manchester United' },
    { id: 6, name: 'Tottenham' },
    { id: 7, name: 'Real Madrid' },
    { id: 8, name: 'Barcelona' },
    { id: 9, name: 'Bayern Munich' },
    { id: 10, name: 'PSG' },
  ],

  NATIONS: [
    { id: 1, name: 'England' },
    { id: 2, name: 'Spain' },
    { id: 3, name: 'France' },
    { id: 4, name: 'Germany' },
    { id: 5, name: 'Italy' },
    { id: 6, name: 'Portugal' },
    { id: 7, name: 'Argentina' },
    { id: 8, name: 'Brazil' },
    { id: 9, name: 'Netherlands' },
    { id: 10, name: 'Belgium' },
  ],

  LEAGUES: [
    { id: 1, name: 'Premier League' },
    { id: 2, name: 'La Liga' },
    { id: 3, name: 'Bundesliga' },
    { id: 4, name: 'Serie A' },
    { id: 5, name: 'Ligue 1' },
    { id: 6, name: 'MLS' },
    { id: 7, name: 'Saudi Pro League' },
  ],

  POSITIONS: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],

  HEALTH_CHECK: {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  },
};

/**
 * Mock card data stored in localStorage
 */
export const MOCK_STORED_CARDS = [
  {
    id: 'card-1',
    name: 'Cristiano Ronaldo',
    club: 'Al-Nassr',
    nationality: 'Portugal',
    league: 'Saudi Pro League',
    position: 'Forward',
    stats: { defence: 45, control: 88, attack: 95 },
    photo: '/api/photos/cristiano-ronaldo.jpg',
    background: 'Classic Green',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'card-2',
    name: 'Lionel Messi',
    club: 'Inter Miami',
    nationality: 'Argentina',
    league: 'MLS',
    position: 'Forward',
    stats: { defence: 35, control: 92, attack: 94 },
    photo: '/api/photos/lionel-messi.jpg',
    background: 'Royal Blue',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Generate mock API response for clubs endpoint
 */
export function mockClubsResponse() {
  return {
    status: 200,
    data: MOCK_API_RESPONSES.CLUBS,
  };
}

/**
 * Generate mock API response for nations endpoint
 */
export function mockNationsResponse() {
  return {
    status: 200,
    data: MOCK_API_RESPONSES.NATIONS,
  };
}

/**
 * Generate mock API response for leagues endpoint
 */
export function mockLeaguesResponse() {
  return {
    status: 200,
    data: MOCK_API_RESPONSES.LEAGUES,
  };
}

/**
 * Generate mock API response for positions endpoint
 */
export function mockPositionsResponse() {
  return {
    status: 200,
    data: MOCK_API_RESPONSES.POSITIONS,
  };
}

/**
 * Generate mock health check response
 */
export function mockHealthCheckResponse() {
  return {
    status: 200,
    data: MOCK_API_RESPONSES.HEALTH_CHECK,
  };
}

/**
 * Mock API error responses
 */
export const MOCK_API_ERRORS = {
  NOT_FOUND: {
    status: 404,
    data: { error: 'Resource not found' },
  },
  SERVER_ERROR: {
    status: 500,
    data: { error: 'Internal server error' },
  },
  NETWORK_ERROR: {
    status: 'NETWORK_ERROR',
    message: 'Failed to fetch',
  },
};

/**
 * Create mock localStorage data for testing
 */
export function createMockLocalStorageData(cards = MOCK_STORED_CARDS) {
  return {
    'football-cards': JSON.stringify(cards),
  };
}
