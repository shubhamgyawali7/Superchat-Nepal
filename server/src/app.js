import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import auth from "./routes/auth.js";
import streamer from "./routes/streamer.js";
import donation from "./routes/donation.js";
import { createClient } from "./config/supabase.js";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  req.supabase = createClient(req, res);
  req.io = io; // Attach socket.io instance to request
  next();
});

app.get("/", (req, res) => {
  res.json({ appname: "superchat nepal", version: "1.1.0" });
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

// 3. Routes
app.use("/api/auth", auth);
app.use('/api/streamer', streamer);
app.use('/api/donations', donation);

// Socket.io connection logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  socket.on("join-streamer", (username) => {
    socket.join(username);
    console.log(`Socket ${socket.id} joined room: ${username}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}...........`);
});

