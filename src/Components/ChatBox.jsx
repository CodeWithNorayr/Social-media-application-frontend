import React, { useContext, useEffect } from "react";
import { ChatContext } from "../Context/ChatContext";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatBox = () => {
  const { messages, setMessages, socket } = useContext(ChatContext);

  useEffect(() => {
    if (!socket) return; // 🔥 safety check

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup on unmount or socket change
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setMessages]); // 🔥 run effect if socket changes

  return (
    <div className="chat-box">
      <MessageList messages={messages} />
      <MessageInput />
    </div>
  );
};

export default ChatBox;