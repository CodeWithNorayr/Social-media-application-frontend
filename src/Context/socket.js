import { io } from "socket.io-client";

let socket = null;

export const createSocket = (userId) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io("https://social-media-application-backend-1-8422.onrender.com", {
    query: { userId },

    // IMPORTANT FIXES FOR PRODUCTION
    transports: ["websocket", "polling"],
    withCredentials: true,

    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000
  });

  return socket;
};
