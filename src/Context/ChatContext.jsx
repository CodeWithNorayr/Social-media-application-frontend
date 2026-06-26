import { createContext, useState, useEffect, useContext } from "react";
import * as api from "../services/messageService";
import { createSocket } from "./socket";
import axios from "axios";
import { StoreContext } from "./AuthContext/AuthContext";
import { toast } from "react-toastify";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { backendURL, token, userData } = useContext(StoreContext);

  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
      CONNECTIONS
  ========================= */
  const fetchingConnections = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${backendURL}/api/user/connections`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        setUsers(res.data.connections);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingConnections();
  }, [token]);

  /* =========================
      SOCKET INIT (FIXED)
  ========================= */
  useEffect(() => {
    if (!userData?._id) return;

    const newSocket = createSocket(userData._id);
    setSocket(newSocket);

    // FIXED EVENT NAME
    newSocket.on("newMessage", (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    return () => {
      newSocket.off("newMessage");
      newSocket.disconnect();
    };
  }, [userData?._id]);

  /* =========================
      SELECT USER
  ========================= */
  const selectUser = async (user) => {
    setSelectedUser(user);
    await fetchMessages(user._id);
  };

  /* =========================
      FETCH MESSAGES
  ========================= */
  const fetchMessages = async (userId) => {
    if (!token) return;

    try {
      const res = await api.getMessages(userId, token);

      // backend returns: { messages }
      setMessages(res.data.messages || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch messages");
    }
  };

  /* =========================
      SEND MESSAGE (FIXED)
  ========================= */
  const sendNewMessage = async (receiverId, data) => {
    if (!token) return;

    try {
      const res = await api.sendMessage(receiverId, data, token);

      // backend returns: { data: newMessage }
      const newMessage = res.data.data;

      setMessages((prev) => [...prev, newMessage]);

      if (socket) {
        socket.emit("sendMessage", newMessage);
      }
    } catch (err) {
      console.log(err);
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
