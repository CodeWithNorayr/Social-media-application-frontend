import axios from "axios";

// Create an API instance
export const createAPI = (token) => {
  return axios.create({
    baseURL: "https://social-media-application-backend-1-8422.onrender.com/api/message",
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
};

// Get messages with a user
export const getMessages = (id, token) => {
  const API = createAPI(token);
  return API.get(`/chat/messages/${id}`);
};

// Send message
export const sendMessage = (id, formData, token) => {
  const API = createAPI(token);
  return API.post(`/send/messages/${id}`, formData);
};

// Mark message seen
export const markSeen = (id, token) => {
  const API = createAPI(token);
  return API.post(`/messages/${id}/seen`);
};

// Get unseen messages
export const getUnseen = (token) => {
  const API = createAPI(token);
  return API.get(`/messages/unseen`);
};
