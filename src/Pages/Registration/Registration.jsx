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
    dob:"",
    image: null,
    coverPhoto: null
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const fileChangeHandler = (e) => {
    const { name, files } = e.target;
    setData(prev => ({ ...prev, [name]: files[0] }));
  };

  // Submit form
  const submitUserRegistrationForm = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Append text fields
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("location", data.location);
      formData.append("bio", data.bio);
      formData.append("dob", data.dob);

      // Append files
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
        localStorage.setItem("userId",response.data.user._id);
        toast.success(`${response.data.user.name} registered successfully`);
        navigate('/account-verification/code/send');
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
        <div>
          <input
            type="text"
            name="name"
            placeholder="Adam Smith"
            value={data.name}
            onChange={onChangeHandler}
            required
          />
          <p>Username</p>
        </div>

        {/* EMAIL */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="adam@gmail.com"
            value={data.email}
            onChange={onChangeHandler}
            required
          />
          <p>Email</p>
        </div>

        {/* PASSWORD */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="aA@#******"
            value={data.password}
            onChange={onChangeHandler}
            required
          />
          <p>Password (aA#@***) </p>
        </div>

        {/* LOCATION */}
        <div>
          <input
            type="text"
            name="location"
            placeholder="Yerevan"
            value={data.location}
            onChange={onChangeHandler}
          />
          <p>Location</p>
        </div>

        {/* BIO */}
        <div>
          <textarea
            name="bio"
            placeholder="Tell about yourself..."
            value={data.bio}
            onChange={onChangeHandler}
          />
          <p>Bio</p>
        </div>

        <div>
          <input 
            type="date" 
            name="dob" 
            id="dob" 
            value={data.dob}
            onChange={onChangeHandler}
          />
        </div>

        {/* PROFILE IMAGE */}
        <div>
          <input
            type="file"
            name="image"
            onChange={fileChangeHandler}
          />
          <p>Profile Image</p>
        </div>

        {/* COVER PHOTO */}
        <div>
          <input
            type="file"
            name="coverPhoto"
            onChange={fileChangeHandler}
          />
          <p>Cover Photo</p>
        </div>

        <div>
          <p>Already have an account ? <span onClick={()=>navigate("/user/login")} style={{cursor:"pointer", textDecoration:"underline"}}>Login</span></p>
        </div>

        {/* BUTTON */}
        <button
          className='user-form-registration-submit-button'
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Register"}
        </button>

      </form>
    </div>
  );
};

export default Registration;
