import React from 'react';
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from '../../Context/AuthContext/AuthContext';
import { useContext, useState } from 'react';

const Login = () => {

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    password: "",
    email: ""
  });

  const { backendURL, setToken, navigate } = useContext(StoreContext)

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData((data) => ({ ...data, [name]: value }))
  };

  const submitLoginForm = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendURL}/api/user/user-loggin`, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id); // ✅ IMPORTANT
        toast.success(`${response.data.user.name} is successfully logged in`);
        navigate("/user/post/section");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Loggin failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="user-registration-content">
      <form onSubmit={submitLoginForm} className='user-form-registration'>

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
            placeholder="********"
            value={data.password}
            onChange={onChangeHandler}
            required
          />
            <p>Password</p>
        </div>

        <div>
          <p>Need an account ? <span onClick={()=>navigate("/user/registration")} style={{cursor:'pointer',textDecoration:"underline"}}>Register</span></p>
        </div>

        {/* BUTTON */}
        <button
          className='user-form-registration-submit-button'
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>

      </form>
    </div>
  );
}

export default Login
