import axios from 'axios';
import { ApiResponse } from './types';

export const fetchNutritionData = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>(route('api.classify.data'));
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    throw error;
  }
};
