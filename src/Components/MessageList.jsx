import React, { useEffect, useRef } from "react";
import "./MessageList.css";

const MessageList = ({ messages }) => {
  const currentUserId = localStorage.getItem("userId");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages?.map((msg, index) => {
        const isMe = String(msg.senderId) === String(currentUserId);

        return (
          <div
            key={msg._id}
            ref={index === messages.length - 1 ? scrollRef : null}
            className={`message-row ${isMe ? "me" : "other"}`}
          >
            <div className="message-bubble">
              {msg.text && <p>{msg.text}</p>}

              {msg.image && (
                <img src={msg.image} alt="attachment" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;