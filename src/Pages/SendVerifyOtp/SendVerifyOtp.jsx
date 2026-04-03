import React, { useContext } from 'react';
import "./SendVerifyOtp.css";
import axios from 'axios';
import { toast } from "react-toastify";
import { StoreContext } from '../../Context/AuthContext/AuthContext';

const SendVerifyOtp = () => {

  const { backendURL, token, navigate } = useContext(StoreContext);

  const sendingOtpToEmail = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${backendURL}/api/user/user-otpVerification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Verification code is sent to your email");
        navigate("/confirmation/code/verify");
      } else {
        toast.warn("Verification code failed, please try again later");
      }

    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  return (
    <div className='SendVerifyOtp-full-div-section'>
      <form onSubmit={sendingOtpToEmail} className='SendVerifyOtp-full-div-section-form'>
        <div className='Account-verification-sendVerifyOtp'>
          <h1 className='SendVerifyOtp-full-div-section-h1'>Account verification</h1>
        </div>
        <div className='SendVerifyOtp-full-div-section-email'>
          <h3 className='SendVerifyOtp-full-div-section-email-h3'>Verification code will be sent to your email</h3>
        </div>
        <div className='SendVerifyOtp-full-div-section-button-submit'>
          <button className='SendVerifyOtp-full-div-section-button-submit-btn' type="submit">Verify</button>
        </div>
      </form>
    </div>
  )
}

export default SendVerifyOtp