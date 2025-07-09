import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

// ✅ CORS setup for both localhost and deployed frontend
const allowedOrigins = [
     "http://localhost:5173",
     "https://chat-app-yt.onrender.com",
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ✅ Static files (for production build)
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// ✅ Friendly backend root route
app.get("/", (req, res) => {
     res.send("✅ Chat App Backend is running.");
});

// Optional ping for uptime monitoring
app.get('/ping', (req, res) => {
     res.send('pong');
});

// ✅ Wildcard route for frontend SPA
app.get("*", (req, res) => {
     res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// ✅ Start server
server.listen(PORT, () => {
     connectToMongoDB();
     console.log(`✅ Server running on port ${PORT}`);
});
