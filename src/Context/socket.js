import { io } from "socket.io-client";

export const createSocket = (userId) => {
  return io("http://localhost:4000", {
    query: { userId }
  });
};