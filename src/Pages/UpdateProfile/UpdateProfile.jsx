import React, { useContext, useState } from "react";
import "./UpdateProfile.css";
import { StoreContext } from "../../Context/AuthContext/AuthContext";
import assets from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const { backendURL, token, navigate } = useContext(StoreContext);

  const [data, setData] = useState({
    name: "",
    location: "",
    password: "",
    dob: "",
    bio: "",
  });

  const [image, setImage] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const fileChangeHandler = (e) => {
    const { name, files } = e.target;

    if (name === "image") setImage(files[0]);
    if (name === "coverPhoto") setCoverPhoto(files[0]);
  };

  const updateUserAccountData = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // IMPORTANT: only send fields if user typed something
      if (data.name) formData.append("name", data.name);
      if (data.password) formData.append("password", data.password);
      if (data.location) formData.append("location", data.location);
      if (data.bio) formData.append("bio", data.bio);

      if (data.dob) {
        formData.append("dob", new Date(data.dob).toISOString());
      }

      if (image) formData.append("image", image);
      if (coverPhoto) formData.append("coverPhoto", coverPhoto);

      const response = await axios.put(
        `${backendURL}/api/user/update-user-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");
        navigate("/user/profile");
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile-update-full-form">
      <form onSubmit={updateUserAccountData} className="user-profile-update-form">

        <h3>Update Profile</h3>

        <input
          type="text"
          name="name"
          placeholder="Username"
          value={data.name}
          onChange={onChangeHandler}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={data.location}
          onChange={onChangeHandler}
        />

        <input
          type="text"
          name="bio"
          placeholder="Bio"
          value={data.bio}
          onChange={onChangeHandler}
        />

        <input
          type="date"
          name="dob"
          value={data.dob}
          onChange={onChangeHandler}
        />

        <label>
          <p>Profile Image</p>
          <img src={assets.UploadImage} alt="upload" />
          <input type="file" name="image" hidden onChange={fileChangeHandler} />
        </label>

        <label>
          <p>Cover Photo</p>
          <img src={assets.CoverPhoto} alt="cover" />
          <input type="file" name="coverPhoto" hidden onChange={fileChangeHandler} />
        </label>

        <input
          type="password"
          name="password"
          placeholder="New password"
          value={data.password}
          onChange={onChangeHandler}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </form>
    </div>
  );
};

export default UpdateProfile;
