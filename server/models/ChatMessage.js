import mongoose from "mongoose";

const ChatMessageSchema = mongoose.Schema(
  {
    chatRoomId: String,
    sender: String,
    username: String,
    message: String,
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

export default ChatMessage;
