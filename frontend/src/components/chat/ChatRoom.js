import React, { useState, useEffect, useRef } from "react";
import { getMessagesOfChatRoom, sendMessage } from "../../services/ChatService";
import Message from "./Message";
import Contact from "./Contact";
import ChatForm from "./ChatForm";

export default function ChatRoom({ currentChat, currentUser, socket, user, showName = true }) {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);

  const scrollRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMessagesOfChatRoom(currentChat._id);
        setMessages(res);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchData();
  }, [currentChat._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    socket.current?.on("getMessage", (data) => {
      console.log("Received message data:", data);
  
      setIncomingMessage({
        senderId: data.sender,
        senderName: data.username || data.sender, // Use username if available, otherwise use sender ID
        message: data.message,
      });
    });
  }, [socket]);
  

  useEffect(() => {
    incomingMessage && setMessages((prev) => [...prev, incomingMessage]);
  }, [incomingMessage]);

  const renderMessages = (messages) => {
    console.log(messages);
    console.log(currentUser);
    return messages.map((message, index) => (
      <div key={index} ref={index === messages.length - 1 ? scrollRef : null}>
        <Message
          message={message}
          self={currentUser.username}
          displayName={user?.username}
        />
        {showName && message.username && (
          <div className="text-sm text-gray-500">
            {/* {message.username}: {message.message} */}
          </div>
        )}
      </div>
    ));
  };

  const handleFormSubmit = async (message) => {
    const receiverId = currentChat.members.find(
      (member) => member !== currentUser.uid
    );

socket.current.emit('sendMessage', {
  chatRoomId: currentChat._id,
  sender: currentUser.uid,
  receiverId: receiverId,
  message: message,
  username: currentUser.displayName,
});


    const messageBody = {
      chatRoomId: currentChat._id,
      sender: currentUser.uid,
      message: message,
      username: currentUser.displayName,
    };

    try {
      const res = await sendMessage(messageBody);
      setMessages([...messages, res]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="lg:col-span-2 lg:block h-screen w-full">
      <div className="w-full h-full">
        <div className="p-3">
          <Contact chatRoom={currentChat} currentUser={currentUser} />
        </div>

        <div className="relative p-1 overflow-y-auto h-[30rem] bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <ul className="space-y-2">{renderMessages(messages)}</ul>
        </div>

        <ChatForm handleFormSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}
