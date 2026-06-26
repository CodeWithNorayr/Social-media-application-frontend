import React, { useContext, useState } from "react";
import "./SendVerifyOtp.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../Context/AuthContext/AuthContext";

const SendVerifyOtp = () => {
  const { backendURL, navigate } = useContext(StoreContext);
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const sendingOtpToEmail = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${backendURL}/api/user/user-otp-verification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("OTP RESPONSE:", response.data);

      if (response.data?.success === true) {
        toast.success("Code sent");
        navigate("/confirmation/code/verify");
      } else {
        toast.warn(response.data?.message || "Failed");
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="SendVerifyOtp-full-div-section">
      <form
        onSubmit={sendingOtpToEmail}
        className="SendVerifyOtp-full-div-section-form"
      >
        <h1 className="SendVerifyOtp-full-div-section-h1">
          Account verification
        </h1>

        <h3 className="SendVerifyOtp-full-div-section-email-h3">
          Verification code will be sent to your email
        </h3>

        <button
          className="SendVerifyOtp-full-div-section-button-submit-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default SendVerifyOtp;
