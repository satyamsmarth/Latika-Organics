import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://latika-organics-backend.onrender.com", {
      transports: ["polling", "websocket"],
      withCredentials: true,
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.log("🚨 Error:", err.message);
    });

    socket.onAny((event, data) => {
      console.log("📡 Event:", event, data);
    });
  }

  return socket;
};