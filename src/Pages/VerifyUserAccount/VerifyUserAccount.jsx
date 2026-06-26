import React, { useContext, useState } from 'react';
import "./VerifyUserAccount.css";
import { StoreContext } from '../../Context/AuthContext/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyUserAccount = () => {
  const { backendURL, navigate, token } = useContext(StoreContext);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyUserAccount = async (event) => {
    event.preventDefault();

    const cleanOtp = otp.trim();

    if (cleanOtp.length !== 6) {
      toast.warn("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${backendURL}/api/user/user-account-verification`,
        { otp: cleanOtp },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response?.data?.success) {
        toast.success("Email successfully verified");
        navigate("/confirmation/code/verify");
      } else {
        toast.warn(response?.data?.message || "Invalid verification code");
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='verify-user-account-section-div-full'>
      <form onSubmit={verifyUserAccount} className='verify-user-account-section'>

        <input
          className='verify-user-account-section-input'
          type="text"
          name="otp"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
          required
          placeholder='Enter 6-digit OTP'
        />

        <button
          className='verify-user-account-section-input-btn'
          type='submit'
          disabled={loading}
        >
          {loading ? "Verifying..." : "Confirm"}
        </button>

      </form>
    </div>
  );
};

export default VerifyUserAccount;
