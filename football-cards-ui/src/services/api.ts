import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

export interface Club {
  id: number;
  name: string;
}

export interface Nationality {
  id: number;
  name: string;
}

export interface League {
  id: number;
  name: string;
}

export interface Position {
  code: string;
  name: string;
}

export const getClubs = async (): Promise<Club[]> => {
  try {
    const response = await api.get('/clubs');
    return response.data;
  } catch (error) {
    console.error('Error fetching clubs:', error);
    throw error;
  }
};

export const getNationalities = async (): Promise<Nationality[]> => {
  try {
    const response = await api.get('/nations');
    return response.data;
  } catch (error) {
    console.error('Error fetching nationalities:', error);
    throw error;
  }
};

export const getLeagues = async (): Promise<League[]> => {
  try {
    const response = await api.get('/leagues');
    return response.data;
  } catch (error) {
    console.error('Error fetching leagues:', error);
    throw error;
  }
};

export const getPositions = async (): Promise<Position[]> => {
  try {
    const response = await api.get('/positions');
    return response.data;
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw error;
  }
};
