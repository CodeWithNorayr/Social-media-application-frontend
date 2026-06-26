import React, { useContext, useState } from "react";
import "./SendVerifyOtp.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../Context/AuthContext/AuthContext";

const sendingOtpToEmail = async (event) => {
  event.preventDefault();

  console.log("Button clicked");

  if (!token) {
    console.log("No token");
    toast.error("You are not logged in");
    return;
  }

  try {
    console.log("Sending request...");

    const response = await axios.post(
      `${backendURL}/api/user/user-otp-verification`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("SERVER RESPONSE:", response.data);

    toast.success("Success");

    console.log("Navigating...");
    navigate("/confirmation/code/verify");

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Server error");
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
