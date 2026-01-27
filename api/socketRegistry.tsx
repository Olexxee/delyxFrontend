import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/constants/storageKeys";

/**
 * Context shape
 */
interface SocketContextValue {
  socket: Socket | null;
}

/**
 * Create context ONCE
 */
const SocketContext = createContext<SocketContextValue>({
  socket: null,
});

/**
 * Provider props
 */
interface SocketProviderProps {
  children: ReactNode;
}

/**
 * Socket Provider
 */
export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let activeSocket: Socket | null = null;

    const initSocket = async () => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      if (!token) {
        console.warn("Socket not initialized: no auth token found");
        return;
      }

      activeSocket = io("https://destructive-island.outray.app", {
        auth: { token },
        transports: ["websocket"],
        autoConnect: true,
      });

      activeSocket.on("connect", () => {
        console.log("Socket connected:", activeSocket?.id);
      });

      activeSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      setSocket(activeSocket);
    };

    initSocket();

    return () => {
      activeSocket?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

/**
 * Consumer hook
 */
export const useSocket = (): Socket | null => {
  const { socket } = useContext(SocketContext);
  return socket;
};
