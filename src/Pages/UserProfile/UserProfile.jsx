import React, { useEffect, useState, useContext } from "react";
import "./UserProfile.css";
import { StoreContext } from "../../Context/AuthContext/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import assets from "../../assets/assets";
import { Ellipsis } from "lucide-react";

const UserProfile = () => {
  const {
    backendURL,
    token,
    navigate,
    countConnections,
    countFollowers,
    countFollowings,
  } = useContext(StoreContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchingUserProfileData = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${backendURL}/api/user/user-profile-page`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUserData(response.data.data);
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Fetching user data failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingUserProfileData();
  }, [token]);

  const deleteUserProfile = async () => {
    if (!token) return;

    try {
      const response = await axios.delete(
        `${backendURL}/api/user/delete-user-account`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Account deleted successfully");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/user/registration");
      } else {
        toast.warn(response.data.message || "Cannot delete account");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  const confirmingAccountDeletion = () => {
    if (!userData) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete your account?\n\nThis action is irreversible.`
    );

    if (confirmed) {
      deleteUserProfile();
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!userData) return null;

  return (
    <div className="user-profile-container">
      <div className="user-profile-content">

        {/* COVER */}
        <img
          className="cover-photo"
          src={userData.coverPhoto || assets.BackGround}
          alt="cover"
        />

        {/* PROFILE IMAGE */}
        <div className="profile-image-section">
          <div className="profile-image">
            <img
              src={userData.image || assets.DefaultProfile}
              alt="profile"
            />
          </div>
        </div>

        {/* INFO */}
        <div className="profile-info">
          <h3>{userData.name}</h3>

          <div className="profile-info-div">
            <p>{userData.email}</p>

            {userData.bio && <p>{userData.bio}</p>}

            {userData.location && <p>{userData.location}</p>}

            <p>
              {userData.dob
                ? new Date(userData.dob).toLocaleDateString()
                : "Add birthday"}
            </p>
          </div>

          {/* MENU */}
          <div className="elipsis-content-section">
            <Ellipsis className="elipsis-icon" />
            <ul className="elipsis-context">
              <li onClick={() => navigate("/user/profile/update")}>Edit</li>
              <li onClick={confirmingAccountDeletion}>Delete</li>
            </ul>
          </div>

          {/* STATS */}
          <div className="profile-info-insides">
            <div onClick={() => navigate("/followers")}>
              <p>{countFollowers}</p>
              <p>Followers</p>
            </div>

            <div onClick={() => navigate("/followings")}>
              <p>{countFollowings}</p>
              <p>Following</p>
            </div>

            <div onClick={() => navigate("/connections")}>
              <p>{countConnections}</p>
              <p>Friends</p>
            </div>

            <div onClick={() => navigate("/chat/page")}>
              <p>Messages</p>
            </div>

            <div onClick={() => navigate("/user/post/section")}>
              <p>Posts</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
