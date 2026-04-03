import React, { useContext, useState } from 'react';
import "./UpdateProfile.css";
import { StoreContext } from '../../Context/AuthContext/AuthContext';
import assets from '../../assets/assets';
import axios from "axios";
import { toast } from "react-toastify";

const UpdateProfile = () => {

  const { backendURL, token, navigate } = useContext(StoreContext);

  const [data, setData] = useState({
    name: "",
    location: "",
    password: "",
    dob: "",
    bio: ""
  });

  const [image, setImage] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  /* TEXT INPUT */
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  /* FILE INPUT */
  const fileChangeHandler = (event) => {
    const { name, files } = event.target;

    if (name === "image") {
      setImage(files[0]);
    } else if (name === "coverPhoto") {
      setCoverPhoto(files[0]);
    }
  };

  /* SUBMIT */
  const updateUserAccountData = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();

      // Always send fields (avoid empty body issue)
      formData.append("name", data.name || "");
      formData.append("password", data.password || "");
      formData.append("location", data.location || "");
      formData.append("bio", data.bio || "");

      // Fix date format
      if (data.dob) {
        formData.append("dob", new Date(data.dob).toISOString());
      }

      // Files
      if (image) formData.append("image", image);
      if (coverPhoto) formData.append("coverPhoto", coverPhoto);

      // DEBUG (very useful)
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.put(
        `${backendURL}/api/user/update-user-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully ✅");
        navigate("/");
      } else {
        toast.error(response.data.message || "Update failed");
      }

    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='user-profile-update-full-form'>
      <form onSubmit={updateUserAccountData} className='user-profile-update-form'>

        <h3>Update account data</h3>

        <div className='user-profile-update-full-div'>

          <div>
            <p>Username</p>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <p>Location</p>
            <input
              type="text"
              name="location"
              value={data.location}
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <p>Bio</p>
            <input
              type="text"
              name="bio"
              value={data.bio}
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <p>Date of birth</p>
            <input
              type="date"
              name="dob"
              value={data.dob}
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <label htmlFor="image">
              <p>Profile picture</p>
              <img
                className='coverPhoto-image-update-profile'
                src={assets.UploadImage}
                alt="upload"
              />
            </label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={fileChangeHandler}
              hidden
            />
          </div>

          <div>
            <label htmlFor="coverPhoto">
              <p>Cover photo</p>
              <img
                className='coverPhoto-image-update-profile'
                src={assets.CoverPhoto}
                alt="cover"
              />
            </label>
            <input
              type="file"
              name="coverPhoto"
              id="coverPhoto"
              onChange={fileChangeHandler}
              hidden
            />
          </div>

          <div>
            <p>New password</p>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <button
              className='save-the-changes-btn'
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save the changes"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;