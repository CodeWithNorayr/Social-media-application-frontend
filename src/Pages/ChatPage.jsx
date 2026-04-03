import React, { useContext } from "react";
import { ChatContext } from "../Context/ChatContext";
import ChatBox from "../Components/ChatBox";

const ChatPage = () => {
  const { users, selectUser, selectedUser } = useContext(ChatContext);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Users List */}
      <div style={{ width: "200px", borderRight: "1px solid #ccc", padding: "10px" }}>
        <h3>Users</h3>
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              style={{
                padding: "8px",
                marginBottom: "5px",
                cursor: "pointer",
                backgroundColor: selectedUser?._id === user._id ? "#eee" : "#fff",
                borderRadius: "5px",
              }}
              onClick={() => selectUser(user)}
            >
              {user.name}
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>

      {/* Chat Box */}
      <div style={{ flex: 1 }}>
        {selectedUser ? (
          <ChatBox />
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;