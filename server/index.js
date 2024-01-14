import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import "./config/mongo.js";
import { VerifyToken, VerifySocketToken } from "./middlewares/VerifyToken.js";
import chatRoomRoutes from "./routes/chatRoom.js";
import chatMessageRoutes from "./routes/chatMessage.js";
import userRoutes from "./routes/user.js";
import ChatMessage from "./models/ChatMessage.js"; // Import your ChatMessage model

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(VerifyToken);

const PORT = process.env.PORT || 8080;

app.use("/api/room", chatRoomRoutes);
app.use("/api/message", chatMessageRoutes);
app.use("/api/user", userRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.use(VerifySocketToken);

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("sendMessage", async (data) => {
    const { chatRoomId, sender, username, message } = data;

    // Save the new message to the database
    const newMessage = new ChatMessage({
      chatRoomId,
      sender,
      username,
      message,
    });

    await newMessage.save();

    // Emit the message to all connected clients
    io.to(chatRoomId).emit("getMessage", {
      sender: newMessage.sender,
      username: newMessage.username,
      message: newMessage.message,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

io.on("addUser", (userId) => {
  onlineUsers.set(userId, socket.id);
  socket.emit("getUsers", Array.from(onlineUsers));
});
