import React, { useContext, useState } from 'react';
import "./Registration.css";
import { StoreContext } from '../../Context/AuthContext/AuthContext';
import axios from "axios";
import { toast } from "react-toastify";

const Registration = () => {
  const { navigate, setToken, backendURL } = useContext(StoreContext);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    bio: "",
    dob: "",
    image: null,
    coverPhoto: null
  });

  const [loading, setLoading] = useState(false);

  // TEXT INPUT
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // FILE INPUT
  const fileChangeHandler = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    setData(prev => ({ ...prev, [name]: files[0] }));
  };

  // SUBMIT
  const submitUserRegistrationForm = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", data.name.trim());
      formData.append("email", data.email.trim());
      formData.append("password", data.password);
      formData.append("location", data.location?.trim() || "");
      formData.append("bio", data.bio?.trim() || "");
      formData.append("dob", data.dob || "");

      if (data.image) formData.append("image", data.image);
      if (data.coverPhoto) formData.append("coverPhoto", data.coverPhoto);

      const response = await axios.post(
        `${backendURL}/api/user/user-registration`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id);

        toast.success(`${response.data.user.name} registered successfully`);

        navigate('/account-verification/code/send');
      } else {
        toast.error("Registration failed");
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-registration-content">
      <form onSubmit={submitUserRegistrationForm} className='user-form-registration'>

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Adam Smith"
          value={data.name}
          onChange={onChangeHandler}
          required
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="adam@gmail.com"
          value={data.email}
          onChange={onChangeHandler}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="aA@#******"
          value={data.password}
          onChange={onChangeHandler}
          required
        />

        {/* LOCATION */}
        <input
          type="text"
          name="location"
          placeholder="Yerevan"
          value={data.location}
          onChange={onChangeHandler}
        />

        {/* BIO */}
        <textarea
          name="bio"
          placeholder="Tell about yourself..."
          value={data.bio}
          onChange={onChangeHandler}
        />

        {/* DOB */}
        <input
          type="date"
          name="dob"
          value={data.dob}
          onChange={onChangeHandler}
        />

        {/* PROFILE IMAGE */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={fileChangeHandler}
        />

        {/* COVER PHOTO */}
        <input
          type="file"
          name="coverPhoto"
          accept="image/*"
          onChange={fileChangeHandler}
        />

        <p>
          Already have an account?
          <span
            onClick={() => navigate("/user/login")}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            Login
          </span>
        </p>

        <button
          type="submit"
          disabled={loading}
          className='user-form-registration-submit-button'
        >
          {loading ? "Loading..." : "Register"}
        </button>

      </form>
    </div>
  );
};

export default Registration;
