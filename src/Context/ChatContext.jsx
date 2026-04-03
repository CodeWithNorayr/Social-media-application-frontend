import { createContext, useState, useEffect, useContext } from "react";
import * as api from "../services/messageService";
import { createSocket } from "./socket";
import axios from "axios";
import { StoreContext } from "./AuthContext/AuthContext";
import { toast } from "react-toastify";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { backendURL, token } = useContext(StoreContext);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user connections
  const fetchingConnections = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api/user/connections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUsers(response.data.connections);
      } else {
        toast.warn("Server error");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchingConnections();
  }, [backendURL, token]);

  // Initialize socket
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const newSocket = createSocket(userId);
    setSocket(newSocket);

    newSocket.on("receiveMessage", (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    return () => {
      newSocket.off("receiveMessage");
      newSocket.disconnect();
    };
  }, []);

  // Select user
  const selectUser = async (user) => {
    setSelectedUser(user);
    await fetchMessages(user._id);
  };

  // Fetch messages with a user
  const fetchMessages = async (userId) => {
    if (!token) return;
    try {
      const res = await api.getMessages(userId, token);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch messages");
    }
  };

  // Send a new message
  const sendNewMessage = async (receiverId, data) => {
    if (!token) return;
    try {
      const res = await api.sendMessage(receiverId, data, token);
      const message = res.data.data;

      setMessages((prev) => [...prev, message]);

      if (socket) {
        socket.emit("sendMessage", message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        selectedUser,
        selectUser,
        setSelectedUser,
        fetchMessages,
        sendNewMessage,
        socket,
        users,
        loading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};