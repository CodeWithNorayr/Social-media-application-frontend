import React, { useContext } from "react";
import { ChatContext } from "../Context/ChatContext";
import ChatBox from "../Components/ChatBox";

const ChatPage = () => {
  const { users, selectUser, selectedUser, loading } = useContext(ChatContext);

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* USERS LIST */}
      <div style={{ width: "250px", borderRight: "1px solid #ddd", padding: "10px" }}>
        <h3>Users</h3>

        {loading ? (
          <p>Loading...</p>
        ) : Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => selectUser(user)}
              style={{
                padding: "10px",
                marginBottom: "6px",
                cursor: "pointer",
                borderRadius: "6px",
                backgroundColor:
                  selectedUser?._id === user._id ? "#e6e6e6" : "transparent",
              }}
            >
              {user.name}
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>

      {/* CHAT BOX */}
      <div style={{ flex: 1, padding: "10px" }}>
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
