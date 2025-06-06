type Status = "loading" | "connected" | "disconnected" | undefined;

interface Session {
  accessToken: string;
  refreshToken: string;
}
