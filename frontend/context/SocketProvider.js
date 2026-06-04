"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("https://latika-organics-backend.onrender.com", {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ GLOBAL SOCKET CONNECTED:", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ GLOBAL SOCKET DISCONNECTED:", reason);
    });

    newSocket.on("connect_error", (err) => {
      console.log("🚨 SOCKET ERROR:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // cleanup once when app unloads
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}