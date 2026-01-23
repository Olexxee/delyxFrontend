import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Shape of a group message (for reference, not enforced in JS)
export const NewGroupMessage = {
  chatRoomId: "",
  encryptedContent: "",
  sender: "",
  createdAt: ""
};

// Create the Socket context
const SocketContext = createContext({ socket: null });

// SocketProvider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to your backend socket URL
    const newSocket = io("YOUR_SERVER_URL");
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook to use the socket anywhere
export const useSocket = () => useContext(SocketContext);
