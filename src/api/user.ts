import axios from "axios";

const URL = process.env.EXPO_PUBLIC_API_URL;

export const getUser = async (token: string) => {
  try {
    if (!URL) {
      throw new Error("API URL is not defined in environment variables.");
    }
    const response = await axios.get(`${URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
    if (response.status !== 200) {
      throw new Error(response.data?.message || "Get user failed");
    }
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return {
        error: true,
        message:
          error.response?.data?.message || error.message || "Network error",
        status: error.response?.status,
      };
    }
    return {
      error: true,
      message: error.message || "An unknown error occurred",
    };
  }
};
