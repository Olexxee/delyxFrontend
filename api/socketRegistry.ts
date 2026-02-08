import { STORAGE_KEYS } from "@/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
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

export const SocketProvider: React.FC<SocketProviderProps> = (props) => {
  const { children } = props;

  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const initSocket = useCallback(async (): Promise<void> => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return;

    socketRef.current?.disconnect();

    const newSocket = io("https://logical-bluebird.outray.app", {
      auth: { token },
      transports: ["polling", "websocket"],
      autoConnect: true,
    });

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));

    socketRef.current = newSocket;
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    const run = async (): Promise<void> => {
      await initSocket();
    };

    void run();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [initSocket]);

  const contextValue: SocketContextValue = useMemo(
    () => ({
      socket,
      isConnected,
      refreshSocket: initSocket,
    }),
    [socket, isConnected, initSocket],
  );

  return React.createElement(
    SocketContext.Provider,
    { value: contextValue },
    children,
  );
};

export const useSocket = (): SocketContextValue => {
  const ctx = React.useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
};
