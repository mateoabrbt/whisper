import axios from 'axios';

const URL = process.env.EXPO_PUBLIC_API_URL;

export const joinRoom = async (roomId: string, token: string) => {
  if (!roomId) {
    throw new Error('Room ID is required');
  }
  const body = {
    roomId,
  };
  try {
    const response = await axios.post(`${URL}/room/join`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Join room failed');
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

export const leaveRoom = async (roomId: string, token: string) => {
  if (!roomId) {
    throw new Error('Room ID is required');
  }
  const body = {
    roomId,
  };
  try {
    const response = await axios.post(`${URL}/room/leave`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Leave room failed');
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
      message: error || 'An unknown error occurred',
    };
  }
};

export const allRooms = async (token: string) => {
  try {
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

export const roomMessages = async (roomId: string, token: string) => {
  try {
    const response = await axios.get(`${URL}/room/${roomId}/messages`, {
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

export const markAllRoomsMessagesAsDelivered = async (token: string) => {
  try {
    const response = await axios.post(
      `${URL}/room/all/messages/delivered`,
      undefined,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      },
    );
    if (response.status !== 200) {
      throw new Error(
        response.data?.message || 'Post markAllRoomsMessagesAsDelivered failed',
      );
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

export const markRoomMessagesAsRead = async (roomId: string, token: string) => {
  try {
    const response = await axios.post(
      `${URL}/room/${roomId}/messages/read`,
      undefined,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      },
    );
    if (response.status !== 200) {
      throw new Error(
        response.data?.message || 'Post markAllMessagesAsRead failed',
      );
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
