import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const backendURL =
    "https://social-media-application-backend-1-8422.onrender.com";

  /* =========================
        STATE
  ========================= */
  const [connections, setConnections] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const [countConnections, setCountConnections] = useState(0);
  const [countFollowings, setCountFollowings] = useState(0);
  const [countFollowers, setCountFollowers] = useState(0);
  const [countPendingRequests, setCountPendingRequests] = useState(0);

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [userData, setUserData] = useState(null);

  /* =========================
        AXIOS HELPERS
  ========================= */
  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` }
  };

  /* =========================
        CONNECTIONS
  ========================= */
  const getUserConnections = async () => {
    try {
      const res = await axios.get(
        `${backendURL}/api/user/connections`,
        authHeaders
      );

      if (res.data.success) {
        setConnections(res.data.connections);
        setFollowers(res.data.followers);
        setFollowings(res.data.following);
        setPendingRequests(res.data.pendingConnections);

        setCountConnections(res.data.countConnections);
        setCountFollowers(res.data.countFollowers);
        setCountFollowings(res.data.countFollowing);
        setCountPendingRequests(res.data.countPendingRequests);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load connections");
    }
  };

  const acceptingFriendRequest = async (id) => {
    try {
      const res = await axios.post(
        `${backendURL}/api/user/connection/accept/${id}`,
        {},
        authHeaders
      );

      if (res.data.success) {
        toast.success("Friend request accepted");
        getUserConnections(); // refresh
      }
    } catch (err) {
      console.log(err);
      toast.error("Error accepting request");
    }
  };

  /* =========================
        USERS LIST
  ========================= */
  const fetchingAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendURL}/api/total/users`,
        authHeaders
      );

      if (res.data.success) {
        setUsersList(res.data.data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
        USER DATA
  ========================= */
  const fetchingUserData = async () => {
    try {
      const res = await axios.get(
        `${backendURL}/api/user/user-profile-page`,
        authHeaders
      );

      if (res.data.success) {
        setUserData(res.data.data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch user");
    }
  };

  /* =========================
        LOAD TOKEN
  ========================= */
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
    setAuthLoading(false);
  }, []);

  /* =========================
        SAVE TOKEN
  ========================= */
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  /* =========================
        FETCH DATA ON TOKEN
  ========================= */
  useEffect(() => {
    if (!token) return;

    fetchingUserData();
    getUserConnections();
    fetchingAllUsers();
  }, [token]);

  /* =========================
        CONTEXT VALUE
  ========================= */
  const value = {
    navigate,
    backendURL,
    token,
    setToken,

    userData,
    setUserData,

    usersList,
    setUsersList,

    connections,
    followers,
    followings,
    pendingRequests,

    acceptingFriendRequest,

    countConnections,
    countFollowers,
    countFollowings,
    countPendingRequests,

    loading,
    authLoading
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
