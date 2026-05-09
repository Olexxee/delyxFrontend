import { STORAGE_KEYS } from "@/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

export interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  refreshSocket: () => Promise<void>;
}

export const SocketContext = createContext<SocketContextValue>(
  {} as SocketContextValue,
);

export interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);

  const [isConnected, setIsConnected] = useState(false);

  /* -----------------------------
       Initialize or refresh socket
    ----------------------------- */
  const initSocket = useCallback(async (): Promise<void> => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return;

    socketRef.current?.disconnect();

    const newSocket = io("https://new-lapislazuli.outray.app", {
      auth: { token },
      transports: ["polling", "websocket"],
      autoConnect: true,
    });

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));

    socketRef.current = newSocket;
  }, []);

  /* -----------------------------
       Init socket on mount
    ----------------------------- */
  useEffect(() => {
    void initSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [initSocket]);

  /* -----------------------------
       Context value (socket is stable)
    ----------------------------- */
  const contextValue = React.useMemo<SocketContextValue>(
    () => ({
      socket: socketRef.current,
      isConnected,
      refreshSocket: initSocket,
    }),
    [isConnected, initSocket],
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

/* -----------------------------
   Custom hook for consuming
----------------------------- */
export const useSocket = (): SocketContextValue => {
  const ctx = React.useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
};
