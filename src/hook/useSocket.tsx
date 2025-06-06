import { useEffect, useRef, useState } from "react";

import { io, Socket } from "socket.io-client";

import { useAppSelector } from "@redux/hook";

const URL = process.env.EXPO_PUBLIC_API_URL;

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { session } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!URL || !session) return;
    const socket = io(`${URL}/room`, {
      transports: ["websocket"],
      auth: { token: session.accessToken },
    });

    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.disconnect();
      setIsConnected(false);
      socketRef.current = null;
    };
  }, []);

  return { socket: socketRef.current, isConnected };
}
