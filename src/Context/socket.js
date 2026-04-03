import { io } from "socket.io-client";

export const createSocket = (userId) => {
  return io("https://social-media-application-backend-1-8422.onrender.com", {
    query: { userId }
  });
};
