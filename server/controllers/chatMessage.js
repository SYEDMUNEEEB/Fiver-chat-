import ChatMessage from "../models/ChatMessage.js";

export const createMessage = async (req, res) => {
  const { chatRoomId, sender, username, message } = req.body;

  // console.log("Request Body:", req.body); // Add this line for debugging

  const newMessage = new ChatMessage({
    chatRoomId,
    sender,
    username,
    message,
  });

  try {
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(409).json({
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      chatRoomId: req.params.chatRoomId,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};
