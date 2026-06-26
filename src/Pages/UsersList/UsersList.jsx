import React, { useContext, useState, useEffect, useMemo } from 'react';
import "./UsersList.css";
import { StoreContext } from '../../Context/AuthContext/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User } from 'lucide-react';

const UsersList = () => {
  const { backendURL, token, navigate } = useContext(StoreContext);

  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${backendURL}/api/total/users/application/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response?.data?.data;

      if (response?.data?.success && Array.isArray(data)) {
        setUsersList(data);
      } else {
        setUsersList([]);
        toast.warn("No users registered yet.");
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAFE FILTER + SAFE SORT (NO MUTATION)
  const filteredUsers = useMemo(() => {
    return [...usersList]
      .filter((user) =>
        user?.name?.toLowerCase().includes(searchName.toLowerCase())
      )
      .sort((a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
  }, [usersList, searchName]);

  return (
    <div className="user-full-sections">

      {/* TITLE */}
      <div className="user-full-sections-h1-title">
        <h1 className="user-full-sections-h1-title-users">Users</h1>

        <div className="user-search-input">
          <input
            className="user-search-input-inside"
            type="text"
            placeholder="Search users..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="user-full-sections-ul-sect">
        <ul className="user-full-sections-ul-sect-li">
          <li>Friends</li>
          <li>Following</li>
          <li>Followers</li>
          <li>Requests</li>
        </ul>
      </div>

      {/* USERS LIST */}
      <div className="users-list-container">

        {loading ? (
          <p>Loading...</p>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => navigate(`/user/profile/page/${user._id}`)}   // ✅ FIXED PATH
              className="user-item"
            >
              {user.image ? (
                <img src={user.image} alt={user.name || "User"} />
              ) : (
                <User className="user-image-by-default" />
              )}
              <p>{user.name || "No Name"}</p>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}

      </div>
    </div>
  );
};

export default UsersList;
