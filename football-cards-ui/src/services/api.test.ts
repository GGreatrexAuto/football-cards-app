import {
  getClubs,
  getNationalities,
  getLeagues,
  getPositions,
  api,
} from './api';

jest.mock('axios');

const setApiGet = (result: any, shouldReject = false) => {
  (api as any).get = shouldReject
    ? jest.fn().mockRejectedValue(result)
    : jest.fn().mockResolvedValue({ data: result });
};

describe('API service', () => {
  beforeEach(() => {
    // Suppress console.error for error-testing scenarios
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('getClubs returns data on success', async () => {
    const data = [{ id: 1, name: 'Test FC' }];
    setApiGet(data);

    const result = await getClubs();

    expect(result).toEqual(data);
  });

  test('getClubs throws on failure', async () => {
    const error = new Error('Network Error');
    setApiGet(error, true);

    await expect(getClubs()).rejects.toThrow('Network Error');
  });

  test('getNationalities returns data on success', async () => {
    const data = [{ id: 1, name: 'Mockland' }];
    setApiGet(data);

    const result = await getNationalities();

    expect(result).toEqual(data);
  });

  test('getLeagues returns data on success', async () => {
    const data = [{ id: 1, name: 'League X' }];
    setApiGet(data);

    const result = await getLeagues();

    expect(result).toEqual(data);
  });

  test('getPositions returns data on success', async () => {
    const data = ['GK', 'DEF', 'MID', 'FWD'];
    setApiGet(data);

    const result = await getPositions();

    expect(result).toEqual(data);
  });

  test('getNationalities throws on failure', async () => {
    const error = new Error('Network Error');
    setApiGet(error, true);

    await expect(getNationalities()).rejects.toThrow('Network Error');
  });

  test('getLeagues throws on failure', async () => {
    const error = new Error('Network Error');
    setApiGet(error, true);

    await expect(getLeagues()).rejects.toThrow('Network Error');
  });

  test('getPositions throws on failure', async () => {
    const error = new Error('Network Error');
    setApiGet(error, true);

    await expect(getPositions()).rejects.toThrow('Network Error');
  });
});
