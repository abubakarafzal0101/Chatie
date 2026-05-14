import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chatie-chat.vercel.app"],
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

const userSocketMap = {};
const getReveiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
io.on("connection", (socket) => {
  console.log("User Connected");

  const userId = socket.handshake.query.userId;

  // Add user on connection
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Send online users
  io.emit("getOnlineUser", Object.keys(userSocketMap));

  // Remove user on disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected");

    delete userSocketMap[userId];

    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});

export { app, server, getReveiverSocketId, io };
