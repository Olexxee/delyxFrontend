import { API_BASE_URL } from "@/api/api";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type SocketHandler = (payload?: any) => void;

export interface RealtimeSocket {
  on: (event: string, handler: SocketHandler) => RealtimeSocket;
  off: (event: string, handler: SocketHandler) => RealtimeSocket;
  emit: (event: string, payload?: Record<string, unknown>) => RealtimeSocket;
  disconnect: () => void;
}

class ChatWebSocket implements RealtimeSocket {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, Set<SocketHandler>>();
  private intentionalClose = false;
  private hasConnected = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly url: string, private readonly token: string) {
    this.connect();
  }

  private dispatch(event: string, payload?: any) {
    this.handlers.get(event)?.forEach((handler) => handler(payload));
  }

  private connect() {
    this.intentionalClose = false;
    const ws = new WebSocket(this.url);
    this.ws = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "auth", token: this.token }));
    };

    ws.onmessage = (message) => {
      try {
        const event = JSON.parse(String(message.data));
        if (event?.type === "error") {
          this.dispatch("error", event);
          return;
        }
        if (event?.type === "authenticated") {
          this.dispatch(this.hasConnected ? "reconnect" : "connect", event);
          this.hasConnected = true;
        }
        this.dispatch(event?.type, event);
        this.dispatch("message", event);
      } catch {
        this.dispatch("error", { message: "Received an invalid WebSocket event." });
      }
    };

    ws.onerror = () => {
      this.dispatch("error", { message: "Chat connection failed." });
    };

    ws.onclose = () => {
      this.dispatch("disconnect");
      if (!this.intentionalClose && this.reconnectTimer === null) {
        this.reconnectTimer = setTimeout(() => {
          this.reconnectTimer = null;
          if (!this.intentionalClose) this.connect();
        }, 2000);
      }
    };
  }

  on(event: string, handler: SocketHandler) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler);
    return this;
  }

  off(event: string, handler: SocketHandler) {
    this.handlers.get(event)?.delete(handler);
    return this;
  }

  emit(event: string, payload: Record<string, unknown> = {}) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: event, ...payload }));
    }
    return this;
  }

  disconnect() {
    this.intentionalClose = true;
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
    this.handlers.clear();
  }
}

const getWebSocketUrl = () => {
  const apiOrigin = (API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "");
  return apiOrigin.replace(/^https:/i, "wss:").replace(/^http:/i, "ws:") + "/ws/chat";
};

export interface SocketContextValue {
  socket: RealtimeSocket | null;
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
  const socketRef = useRef<ChatWebSocket | null>(null);
  const [socket, setSocket] = useState<RealtimeSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const initSocket = useCallback(async (): Promise<void> => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      return;
    }

    socketRef.current?.disconnect();
    setIsConnected(false);

    const nextSocket = new ChatWebSocket(getWebSocketUrl(), token);
    nextSocket.on("connect", () => setIsConnected(true));
    nextSocket.on("reconnect", () => setIsConnected(true));
    nextSocket.on("disconnect", () => setIsConnected(false));
    socketRef.current = nextSocket;
    setSocket(nextSocket);
  }, []);

  useEffect(() => {
    void initSocket();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [initSocket]);

  const contextValue = React.useMemo(
    () => ({ socket, isConnected, refreshSocket: initSocket }),
    [socket, isConnected, initSocket],
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => {
  const ctx = React.useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
};
