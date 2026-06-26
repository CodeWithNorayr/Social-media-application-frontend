import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";

import { connectDB } from "./Config/db.js";
import connectCloudinary from "./Config/cloudinary.js";

import userRouter from "./Route/userRoute/userRoute.js";
import postRouter from "./Route/postRoute/postRoute.js";
import messageRouter from "./Route/messageRoute/messageRoute.js";
import totalUserRouter from "./Route/userRoute/totalUsersRoute.js";

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 4000;

/* ================= SOCKET ================= */
export const io = new Server(server, {
  cors: {
    origin: "https://social-media-application-frontend-vl2g.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const userSocketMap = {};

/* ================= MIDDLEWARE ================= */
app.use(express.json());

app.use(
  cors({
    origin: "https://social-media-application-frontend-vl2g.onrender.com",
    credentials: true,
  })
);

// FIX for Render crash (NO '*')
app.options(/.*/, cors());

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use("/api/user", userRouter);
app.use("/api/total/users", totalUserRouter);
app.use("/api/post", postRouter);
app.use("/api/message", messageRouter);

/* ================= SOCKET LOGIC ================= */
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

/* ================= START SERVER ================= */
const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed:", err);
    process.exit(1);
  }
};

startServer();
