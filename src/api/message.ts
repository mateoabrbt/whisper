import axios from 'axios';

const URL = process.env.EXPO_PUBLIC_API_URL;

export const sendMessage = async (params: {
  token: string;
  roomId: string;
  content: string;
}): Promise<ApiResponse<Message>> => {
  const { token, roomId, content } = params;

  if (!roomId || !content.trim()) {
    return { error: true, message: 'Room ID and content are required' };
  }
  const body = {
    roomId,
    content,
  };
  try {
    const response = await axios.post(`${URL}/message/send`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
    if (response.status !== 201) {
      return {
        error: true,
        message: response.data?.message || 'Send message failed',
        status: response.status,
      };
    }
    return { error: false, data: response.data };
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

export const deliveredMessage = async (params: {
  token: string;
  roomId: string;
  messageId: string;
}): Promise<ApiResponse<MessageStatus | null>> => {
  const { token, roomId, messageId } = params;
  if (!roomId || !messageId) {
    throw new Error('Room ID and message ID are required');
  }
  const body = {
    roomId,
    messageId,
  };
  try {
    const response = await axios.post(`${URL}/message/delivered`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Delivered message failed');
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

export const readMessage = async (params: {
  token: string;
  roomId: string;
  messageId: string;
}) => {
  const { token, roomId, messageId } = params;

  if (!roomId || !messageId) {
    throw new Error('Room ID and message ID are required');
  }
  const body = {
    roomId,
    messageId,
  };
  try {
    const response = await axios.post(`${URL}/message/read`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Read message failed');
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
