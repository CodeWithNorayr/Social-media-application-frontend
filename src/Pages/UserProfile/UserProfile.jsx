import React, { useEffect, useState, useContext } from 'react';
import "./UserProfile.css";
import { StoreContext } from '../../Context/AuthContext/AuthContext';
import axios from 'axios';
import { toast } from "react-toastify";
import assets from '../../assets/assets';
import { Ellipsis } from 'lucide-react';

const UserProfile = () => {
  const { 
    backendURL, 
    token, 
    navigate, 
    countConnections,
    countFollowers,
    countFollowings,
    countPendingRequests 
  } = useContext(StoreContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchingUserProfileData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api/user/user-profile-page`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
    if (token) fetchingUserProfileData();
  }, [token]);

  const deleteUserProfile = async () => {
    try {
      const response = await axios.delete(`${backendURL}/api/user/delete-user-account`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success("Account is successfully deleted");
        localStorage.removeItem("token");
        navigate("/user/registration");
      } else {
        toast.warn(`${userData.name}, you can not delete this account`)
      }
    } catch (error) {
      console.log(error)
      toast.error("Error 500");
    };
  };

  const confirmingAccountDeletion = () => {
    confirm(`${userData.name}/n Are you sure in deleting your account ? /n Please note that your credentials will be erased from the system`);
    deleteUserProfile();
  }

  return (
    <div className="user-profile-container">
      {loading ? (
        <p>Loading...</p>
      ) : userData ? (
        <div className="user-profile-content">
          {/* Cover photo */}
          {
            userData.coverPhoto ?
              (
                <img className='cover-photo' src={userData.coverPhoto} alt="" />
              )
              :
              (
                <img className='cover-photo' src={assets.BackGround} alt="" />
              )
          }


          {/* Profile image */}
          <div className='profile-image-section'>
            <div className='profile-image'>
              <img src={userData.image} alt="Profile" />
            </div>
          </div>


          {/* User info */}
          <div className="profile-info">
            <h3>{userData.name}</h3>
            <div className='profile-info-div'>
              <p className="profile-info-div-p"><img className='email-image' src={assets.Gmail} alt="" />{userData.email}</p>
              {userData.bio && <p className="profile-info-div-p"><img className='bio-image' src={assets.Writing} alt="" />{userData.bio}</p>}
              {userData.location && <p className="profile-info-div-p"><img className='city-image' src={assets.City} alt="" />{userData.location}</p>}
              <p className="profile-info-div-p"><img className='birthday-image' src={assets.Cake} alt="birthday" />{userData.dob ? (userData.dob).slice(0, 10) : "Add a birthday"}</p>
            </div>
            <div className="elipsis-content-section">
              <Ellipsis className="elipsis-icon" />
              <ul className="elipsis-context">
                <li onClick={() => navigate("/user/profile/update")}>Edit</li>
                <li onClick={() => confirmingAccountDeletion()}>Delete</li>
                <li>Report</li>
              </ul>
            </div>
            <div className='profile-info-insides'>
              <div onClick={()=>navigate("/followers")} className='profile-info-insides-Following'>
                {/*<img className='profile-info-insides-Following-img' src={assets.Following} alt="" />*/}
                <p className='profile-info-insiders-friends-image'>{countFollowers}</p>
                <p className='profile-info-insides-Following-img-p'>Followers</p>
              </div>
              <div onClick={()=>navigate("/followings")} className='profile-info-insides-Followers'>
                {/*<img className='profile-info-insides-Followers-img' src={assets.Followers} alt="" />*/}
                <p className='profile-info-insiders-friends-image'>{countFollowings}</p>
                <p className='profile-info-insides-Followers-p'>Followings</p>
              </div>
              <div onClick={()=>navigate("/connections")} className='profile-info-insiders-friends'>
                {/*<img className='profile-info-insiders-friends-image' src={assets.Friends} alt="" />*/}
                <p className='profile-info-insiders-friends-image'>{countConnections}</p>
                <p className='profile-info-insiders-messages-p'>Friends</p>
              </div>
              <div onClick={()=>navigate("/chat/page")} className='profile-info-insiders-messages'>
                <img className='profile-info-insiders-messages-img' src={assets.Comments} alt="Messages" />
                <p className='profile-info-insiders-messages-p'>Messages</p>
              </div>
              <div onClick={()=>navigate("/user/post/section")} className='profile-info-insiders-posts'>
                <img className='profile-info-insiders-posts-img' src={assets.Posts} alt="Posts" />
                <p className='profile-info-insiders-posts-p'>Posts</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserProfile;