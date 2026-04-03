import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ FIXED
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {

  const navigate = useNavigate();

  const [connections, setConnections] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  // Backend URL
  const backendURL = "https://social-media-application-backend-1-8422.onrender.com";

  // Counting connections, followers, followings, pendingRequests etc. By calling api from the backend
  const [ countConnections, setCountConnections ] = useState(0);
  const [ countFollowings, setCountFollowings ] = useState(0);
  const [ countFollowers, setCountFollowers ] = useState(0);
  const [ countPendingRequests, setCountPendingRequests ] = useState(0);

  // fetching all users 
  const [usersList, setUsersList] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Token state
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // User data
  const [userData, setUserData] = useState(null);

  // Calling accept friend request api from backend
  const acceptingFriendRequest = async (id) => {
    try {
      const response = await axios.post(`${backendURL}/api/user/connection/accept/${id}`,{},{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      if ( response.data.success ) {
        toast.success("You are friends");
      } else {
        toast.error("Server error");
      };
    } catch (error) {
      console.log(error);
      toast.error("Server error 500");
    };
  };

  // Calling getUserConnections api from the backend
  const getUserConnections = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/user/connections`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      if ( response.data.success ) {
        setConnections(response.data.connections);
        setFollowers(response.data.followers);
        setFollowings(response.data.following);
        setPendingRequests(response.data.pendingConnections);

        // Calling count documents
        setCountConnections(response.data.countConnections);
        setCountFollowers(response.data.countFollowers);
        setCountFollowings(response.data.countFollowing);
        setCountPendingRequests(response.data.countPendingRequests);
      } else {
        toast.error("Server error");
      };
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server error");
    };
  };

  useEffect(()=>{
    if (token) {
      getUserConnections();
    }
  },[token]);

  // FetchingAllUsers
  const fetchingAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api/total/users/application/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data.success) {
        setUsersList(response.data.data);
      } else {
        toast.warning("Server is pending, error 500");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error 500");
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    if (token) {
      fetchingAllUsers();
    }
  }, [token]);

  // ✅ Load token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    setAuthLoading(false);
  }, []);

  // ✅ Save token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // ✅ Fetch user data
  const fetchingUserData = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/api/user/user-profile-page`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch user");
    }
  };

  // ✅ Run when token changes
  useEffect(() => {
    if (token) {
      fetchingUserData();
    }
  }, [token]);

  // ✅ IMPORTANT FIX: expose userData
  const value = {
    navigate,
    backendURL,
    token,
    setToken,
    userData,        // ✅ ADDED
    setUserData,      // ✅ ADDED
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
    authLoading
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
