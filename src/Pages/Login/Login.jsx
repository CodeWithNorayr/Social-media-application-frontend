import React, { useContext, useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../Context/AuthContext/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    password: "",
    email: "",
  });

  const { backendURL, setToken, navigate } = useContext(StoreContext);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitLoginForm = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${backendURL}/api/user/user-loggin`,
        {
          email: data.email.trim(),
          password: data.password,
        }
      );

      if (response.data?.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id);

        toast.success(
          `${response.data.user.name} logged in successfully`
        );

        navigate("/user/post/section");
      } else {
        toast.error(response.data?.message || "Login failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Login request failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-registration-content">
      <form onSubmit={submitLoginForm} className="user-form-registration">

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
          <p>
            Need an account?{" "}
            <span
              onClick={() => navigate("/user/registration")}
              style={{
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Register
            </span>
          </p>
        </div>

        {/* BUTTON */}
        <button
          className="user-form-registration-submit-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
