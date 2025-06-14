import axios from 'axios';

const URL = process.env.EXPO_PUBLIC_API_URL;

export const login = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    const body = {
      email: email.trim(),
      password: password.trim(),
    };
    if (!URL) {
      throw new Error('API URL is not defined in environment variables.');
    }
    const response = await axios.post(`${URL}/auth/login`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Post login failed');
    }
    return response.data;
  } catch (error: unknown) {
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
      message:
        error instanceof Error
          ? error.message
          : String(error) || 'An unknown error occurred',
    };
  }
};

export const signup = async (
  email: string,
  username: string,
  password: string,
) => {
  try {
    if (!email || !username || !password) {
      throw new Error('Email and password are required.');
    }
    const body = {
      email: email.trim(),
      username: username.trim(),
      password: password.trim(),
    };
    if (!URL) {
      throw new Error('API URL is not defined in environment variables.');
    }
    const response = await axios.post(`${URL}/auth/register`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    if (response.status !== 201) {
      throw new Error(response.data?.message || 'Post register failed');
    }
    return response.data;
  } catch (error: unknown) {
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
      message:
        error instanceof Error
          ? error.message
          : String(error) || 'An unknown error occurred',
    };
  }
};

export const logout = async () => {
  try {
    if (!URL) {
      throw new Error('API URL is not defined in environment variables.');
    }
    const response = await axios.post(`${URL}/auth/logout`, undefined, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    if (response.status !== 204) {
      throw new Error(response.data?.message || 'Post logout failed');
    }
    return response.data;
  } catch (error: unknown) {
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
      message:
        error instanceof Error
          ? error.message
          : String(error) || 'An unknown error occurred',
    };
  }
};

export const refresh = async (refreshToken: string) => {
  try {
    if (!refreshToken) {
      throw new Error('Refresh token is required.');
    }
    const body = {
      refreshToken: refreshToken.trim(),
    };
    if (!URL) {
      throw new Error('API URL is not defined in environment variables.');
    }
    const response = await axios.post(`${URL}/auth/refresh`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Post refresh failed');
    }
    return response.data;
  } catch (error: unknown) {
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
      message:
        error instanceof Error
          ? error.message
          : String(error) || 'An unknown error occurred',
    };
  }
};
