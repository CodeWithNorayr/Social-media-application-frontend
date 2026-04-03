import React, { useContext, useState, useEffect } from 'react';
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
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendURL}/api/total/users/application/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success && Array.isArray(response.data.data)) {
        setUsersList(response.data.data);
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

  // Filter users based on search input
  const filteredUsers = usersList.filter(user =>
    user.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="user-full-sections">
      {/* TITLE */}
      <div className="user-full-sections-h1-title">
        <h1 className="user-full-sections-h1-title-users">Users</h1>
        <div className="user-search-input">
          <input
            className='user-search-input-inside'
            type="text"
            placeholder="Search users..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </div>
      {/* NAVIGATION TABS */}
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
          filteredUsers
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((user) => (
              <div onClick={()=>navigate(`user/profile/page/${user._id}`)} key={user._id} className="user-item">
                {user.image ? (
                  <img src={user.image} alt={user.name} />
                ) : (
                  <User className="user-image-by-default" />
                )}
                <p>{user.name}</p>
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