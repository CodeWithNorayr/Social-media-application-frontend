import React, { useState, useContext } from "react";
import { ChatContext } from "../Context/ChatContext";
import "./MessageInput.css";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { selectedUser, sendNewMessage, socket } = useContext(ChatContext);

  const handleSend = async () => {
    if (!selectedUser || (!text.trim() && !image)) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (image) formData.append("image", image);

      const res = await sendNewMessage(selectedUser._id, formData);

      socket?.emit("sendMessage", {
        ...res.data.data,
        receiverId: selectedUser._id,
      });

      setText("");
      setImage(null);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="message-input-container">
      <input
        className="message-input-field"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        disabled={loading}
      />

      <label className="file-upload">
        📎
        <input
          type="file"
          hidden
          onChange={(e) => setImage(e.target.files[0])}
          disabled={loading}
        />
      </label>

      <button
        className="send-btn"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? "..." : "➤"}
      </button>
    </div>
  );
};

export default MessageInput;