import axios from "axios";

const BASE_URL = "https://social-media-application-backend-1-8422.onrender.com/api/message";

// Create API instance
export const createAPI = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true,
  });
};

// Get messages with a user
export const getMessages = async (id, token) => {
  try {
    const API = createAPI(token);
    return await API.get(`/chat/messages/${id}`);
  } catch (error) {
    throw error;
  }
};

// Send message
export const sendMessage = async (id, formData, token) => {
  try {
    const API = createAPI(token);
    return await API.post(`/send/messages/${id}`, formData);
  } catch (error) {
    throw error;
  }
};

// Mark message as seen
export const markSeen = async (id, token) => {
  try {
    const API = createAPI(token);
    return await API.post(`/messages/${id}/seen`);
  } catch (error) {
    throw error;
  }
};

// Get unseen messages
export const getUnseen = async (token) => {
  try {
    const API = createAPI(token);
    return await API.get(`/messages/unseen`);
  } catch (error) {
    throw error;
  }
};
