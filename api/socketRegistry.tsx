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
    socket: Socket | null;        // stable reference
    isConnected: boolean;
    refreshSocket: () => Promise<void>;
}

export const SocketContext = createContext<SocketContextValue>(
    {} as SocketContextValue
);

export interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    // Ref to store the actual socket instance
    const socketRef = useRef<Socket | null>(null);

    // Only track connection status in state
    const [isConnected, setIsConnected] = useState(false);

    /* -----------------------------
       Initialize or refresh socket
    ----------------------------- */
    const initSocket = useCallback(async (): Promise<void> => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) return;

        // Disconnect previous socket if exists
        socketRef.current?.disconnect();

        const newSocket = io("https://sad-meadow.outray.app", {
            auth: { token },
            transports: ["polling", "websocket"],
            autoConnect: true,
        });

        // Track connection state
        newSocket.on("connect", () => setIsConnected(true));
        newSocket.on("disconnect", () => setIsConnected(false));

        // Assign to ref — ref never changes identity
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
            socket: socketRef.current, // stable reference for effects
            isConnected,
            refreshSocket: initSocket,
        }),
        [isConnected, initSocket]
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