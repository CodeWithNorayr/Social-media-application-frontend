import React, { useContext, useEffect, useState } from 'react';
import "./UserProfilePageById.css";
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../Context/AuthContext/AuthContext';
import assets from '../../assets/assets';
import { Ellipsis } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserProfilePageById = () => {
  const { id } = useParams();
  const {
    usersList,
    backendURL,
    navigate,
    loading,
    token,
    userData,
    setUserData,
    countConnections,
    countFollowers,
    countFollowings,
    countPendingRequests
  } = useContext(StoreContext);
  const [isfollow, setIsfollow] = useState(false);
  const [userSchema, setUserSchema] = useState(null);

  // Call sendingFriendRequest api from backend 

  const sendingFriendRequest = async (id) => {
    try {
      const response = await axios.post(`${backendURL}/api/user/connection/send/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) { toast.success("Friend request is sent") } else { toast.error("Server error") }
    } catch (error) {
      console.log(error)
      toast.error("Error 500");
    }
  }

  useEffect(() => {
    const user = usersList?.find((user) => user._id === id) || null;
    setUserSchema(user);
  }, [usersList, id]);

  if (!userSchema) {
    return <p>Loading user data...</p>;
  }

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

  // Calling following request

  const sendFollowToUser = async (id) => {
    try {
      const response = await axios.post(`${backendURL}/api/user/follow-user/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success("Follow");
      } else {
        toast.error("Server error");
      };
    } catch (error) {
      console.log(error)
      toast.error("Error 500");
    }
  }

  // Calling unfollowUser api from backend

  const unfollowUser = async (id) => {
    try {
      const response = await axios.post(`${backendURL}/api/user/unfollow-user/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        toast.success("Unfollow");
      } else {
        toast.error("Server error");
      };
    } catch (error) {
      console.log(error)
      toast.error("Error 500");
    }
  }

  return (
    <div className="user-profile-container">
      {loading ? (
        <p>Loading...</p>
      ) : userSchema ? (
        <div className="user-profile-content">
          {/* Cover photo */}
          {
            userSchema.coverPhoto ?
              (
                <img className='cover-photo' src={userSchema.coverPhoto} alt="" />
              )
              :
              (
                <img className='cover-photo' src={assets.BackGround} alt="" />
              )
          }


          {/* Profile image */}
          <div className='profile-image-section'>
            <div className='profile-image'>
              <img src={userSchema.image} alt="Profile" />
            </div>
          </div>


          {/* User info */}
          <div className="profile-info">
            <h3>{userSchema.name}</h3>
            <div className='profile-info-div'>
              <p className="profile-info-div-p"><img className='email-image' src={assets.Gmail} alt="" />{userSchema.email}</p>
              {userSchema.bio && <p className="profile-info-div-p"><img className='bio-image' src={assets.Writing} alt="" />{userSchema.bio}</p>}
              {userSchema.location && <p className="profile-info-div-p"><img className='city-image' src={assets.City} alt="" />{userSchema.location}</p>}
              <p className="profile-info-div-p"><img className='birthday-image' src={assets.Cake} alt="birthday" />{userSchema.dob ? (userSchema.dob).slice(0, 10) : "Add a birthday"}</p>
            </div>
            {
              token && userData?._id === userSchema._id
                ?
                (
                  <div className="elipsis-content-section">
                    <Ellipsis className="elipsis-icon" />
                    <ul className="elipsis-context">
                      <li onClick={() => navigate("/user/profile/update")}>Edit</li>
                      <li onClick={() => confirmingAccountDeletion()}>Delete</li>
                      <li>Report</li>
                    </ul>
                  </div>
                )
                :
                (
                  <div className='profile-info-insides-connections'>
                    {isfollow ?
                      (
                        <div className='profile-info-insides-Following'>
                          <button onClick={() => {
                            sendFollowToUser(userSchema._id);
                            setIsfollow(false);
                          }} className='profile-info-insides-Following-img-button'>Follow</button>
                        </div>
                      )
                      :
                      (
                        <div className='profile-info-insiders-friends'>
                          <button onClick={() => {
                            unfollowUser(userSchema._id);
                            setIsfollow(true);
                          }} className='profile-info-insiders-messages-button'>Unfollow</button>
                        </div>
                      )}
                    <div className='profile-info-insides-Followers'>
                      <button onClick={() => sendingFriendRequest(userSchema._id)} className='profile-info-insides-Followers-friend-button'>Friend </button>
                    </div>
                    <div className='profile-info-insides-Followers'>
                      <button className='profile-info-insides-Followers-friend-button-message'>Message</button>
                    </div>
                  </div>
                )
            }
            <div className='profile-info-insides-byIdsec'>
              <div className='profile-info-insides-Following-by-id'>
                {/*<img className='profile-info-insides-Following-img' src={assets.Following} alt="" />*/}
                <p className='profile-info-insiders-messages-p'>{countFollowers}</p>
                <p className='profile-info-insides-Following-img-p'>Followers</p>
              </div>
              <div className='profile-info-insides-Followers-by-id'>
                {/*<img className='profile-info-insides-Followers-img' src={assets.Followers} alt="" />*/}
                <p className='profile-info-insiders-messages-p'>{countFollowings}</p>
                <p className='profile-info-insides-Followers-p'>Following</p>
              </div>
              <div className='profile-info-insiders-friends-by-id'>
                {/*<img className='profile-info-insiders-friends-image' src={assets.Friends} alt="" />*/}
                <p className='profile-info-insiders-messages-p'>{countConnections}</p>
                <p className='profile-info-insiders-messages-p'>Friends</p>
              </div>
              {/*<div className='profile-info-insiders-messages'>
                <img className='profile-info-insiders-messages-img' src={assets.Comments} alt="Messages" />
                <p className='profile-info-insiders-messages-p'>Messages</p>
              </div>*/}
              {/*<div className='profile-info-insiders-posts'>
                <img className='profile-info-insiders-posts-img' src={assets.Posts} alt="Posts" />
                <p className='profile-info-insiders-posts-p'>Posts</p>
              </div>*/}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserProfilePageById;