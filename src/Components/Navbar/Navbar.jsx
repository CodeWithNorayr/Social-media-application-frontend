import React, { useContext, useState } from 'react'
import "./Navbar.css"
import { LogIn, House, Handshake, Bell, MessageCircle, UserRoundKey } from "lucide-react"
import { StoreContext } from '../../Context/AuthContext/AuthContext'
import { toast } from 'react-toastify'

const Navbar = () => {

  const { navigate, token } = useContext(StoreContext);

  const userLoggedOut = () => {
    toast.success("See you soon");
    localStorage.removeItem("token");
    navigate("/user/login");
  }

  return (
    <nav className='Navbar-section'>
      <div className='navbar-button-div'>
        <button onClick={()=>navigate("/user/post/section")} className='navbar-button'>ChatMe</button>
      </div>
      <div className='navbar-ul-section'>
        <ul className='navbar-ul-section-inside'>
          <li onClick={()=>navigate("/user/post/section")} className='navbar-ul-section-inside-li'>
            <House /> <p className='navbar-ul-section-inside-p'>Home</p>
          </li>
          <li onClick={()=>navigate("/connections")} className='navbar-ul-section-inside-li'>
            <Handshake /> <p className='navbar-ul-section-inside-p'>Friends</p>
          </li>
          <li onClick={()=>navigate("/notifications")} className='navbar-ul-section-inside-li'>
            <Bell /> <p className='navbar-ul-section-inside-p'>Notifications</p>
          </li>

          <li onClick={()=>navigate("/chat/page")} className='navbar-ul-section-inside-li'>
            <MessageCircle /> <p className='navbar-ul-section-inside-p'>Messages</p>
          </li>
          <li onClick={()=>navigate("/user/profile")} className='navbar-ul-section-inside-li'>
            <UserRoundKey /> <p className='navbar-ul-section-inside-p'>Profile</p>
          </li>
        </ul>
      </div>
      <div className='navbar-login-LogIn'>
        <LogIn className='navbar-login' />
        {token ? (
          <ul className='navbar-login-section-ul'>
            <li onClick={()=>userLoggedOut()} className='navbar-sign-up-SignUp'>Exit</li>
          </ul>
        ) : (
          <ul className='navbar-login-section-ul'>
            <li className='navbar-sign-in-SignIn'>Sign In</li>
            <li className='navbar-sign-up-SignUp'>Sign Up</li>
          </ul>
        )}

      </div>
    </nav>
  )
}

export default Navbar
