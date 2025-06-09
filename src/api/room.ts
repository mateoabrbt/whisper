import axios from 'axios';

const URL = process.env.EXPO_PUBLIC_API_URL;

export const allRooms = async (token: string) => {
  try {
    if (!URL) {
      throw new Error('API URL is not defined in environment variables.');
    }
    const response = await axios.get(`${URL}/room/all`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Get rooms failed');
    }
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return {
        error: true,
        message:
          error.response?.data?.message || error.message || 'Network error',
        status: error.response?.status,
      };
    }
    return {
      error: true,
      message: error.message || 'An unknown error occurred',
    };
  }
};

export const roomMessages = async (id: string, token: string) => {
  try {
    if (!URL) {
      throw new Error('API URL is not defined in environment variables.');
    }
    const response = await axios.get(`${URL}/room/${id}/messages`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Get messages failed');
    }
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return {
        error: true,
        message:
          error.response?.data?.message || error.message || 'Network error',
        status: error.response?.status,
      };
    }
    return {
      error: true,
      message: error.message || 'An unknown error occurred',
    };
  }
};
