// backend/socket/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// ✅ CORS allowed origins for local + deployed frontend
const io = new Server(server, {
     cors: {
          origin: ["http://localhost:5173", "https://chat-app-yt.onrender.com"],
          methods: ["GET", "POST"],
          credentials: true,
     },
});

const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
     return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
     console.log("🔌 User connected:", socket.id);

     // ✅ Read userId from `auth`, not query
     const userId = socket.handshake.auth.userId;

     if (userId && userId !== "undefined") {
          userSocketMap[userId] = socket.id;
     }

     io.emit("getOnlineUsers", Object.keys(userSocketMap));

     socket.on("disconnect", () => {
          console.log("❌ User disconnected:", socket.id);
          delete userSocketMap[userId];
          io.emit("getOnlineUsers", Object.keys(userSocketMap));
     });
});

export { app, io, server };
