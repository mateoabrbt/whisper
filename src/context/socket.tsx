import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react';

import {io} from 'socket.io-client';

import type {Socket} from 'socket.io-client';

import {useAppSelector} from '@redux/hook';

const URL = process.env.EXPO_PUBLIC_API_URL;

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const {session} = useAppSelector(state => state.user);

  useEffect(() => {
    if (!URL || !session) return;

    const newSocket = io(`${URL}/room`, {
      transports: ['websocket'],
      auth: {token: session.accessToken},
    });

    socketRef.current = newSocket;

    const handleConnect = () => {
      setIsConnected(true);
      newSocket.emit('connectToRoom');
    };
    const handleDisconnect = () => setIsConnected(false);

    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);

    return () => {
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [session]);

  return (
    <SocketContext.Provider value={{socket: socketRef.current, isConnected}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
