import React, { useContext, useState } from 'react'
import "./VerifyUserAccount.css"
import { StoreContext } from '../../Context/AuthContext/AuthContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyUserAccount = () => {

  const { backendURL, navigate, token } = useContext(StoreContext);

  const [otp, setOtp] = useState("");

  const verifyUserAccount = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/api/user/user-verifing-account`, {otp}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success("Email is successfully verified");
        navigate("/user/post/section");
      } else {
        toast.warn("Code is not correct");
      };
    } catch (error) {
      console.log(error);
      toast.error("Error 500");
    };
  };

  return (
    <div className='verify-user-account-section-div-full'>
      <form onSubmit={verifyUserAccount} className='verify-user-account-section'>
        <div>
          <input className='verify-user-account-section-input' type="text" name="otp" id="otp" value={otp} maxLength={6} onChange={(e) => setOtp(e.target.value)} required placeholder='123456' />
          <button className='verify-user-account-section-input-btn' type='submit'>Confirm</button>
        </div>
      </form>
    </div>
  )
}

export default VerifyUserAccount