import { STORAGE_KEYS } from "@/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";


interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  refreshSocket: () => Promise<void>;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const initSocket = useCallback(async () => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    console.log("Retrieved token for socket:", token);
    if (!token) return;

    socketRef.current?.disconnect();

    const newSocket = io("https://passive-plant.outray.app", {
      auth: { token },
      transports: ["polling", "websocket"],
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    initSocket();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [initSocket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        refreshSocket: initSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return ctx;
};
