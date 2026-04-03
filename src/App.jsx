import React from 'react'
import "./App.css"
import { Routes, Route } from "react-router-dom"
import Registration from './Pages/Registration/Registration'
import Home from './Pages/Home/Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Pages/Login/Login'
import UserProfile from './Pages/UserProfile/UserProfile'
import UpdateProfile from './Pages/UpdateProfile/UpdateProfile'
import SendVerifyOtp from './Pages/SendVerifyOtp/SendVerifyOtp'
import VerifyUserAccount from './Pages/VerifyUserAccount/VerifyUserAccount'
import UsersList from './Pages/UsersList/UsersList'
import Post from './Pages/Post/Post'
import UserProfilePageById from './Pages/UserProfilePageById/UserProfilePageById'
import UserProtectedRoute from './Components/UserProtectedRoute/UserProtectedRoute'
import Followings from './Pages/Followings/Followings'
import Followers from './Pages/Followers/Followers'
import Connections from './Pages/Connections/Connections'
import PendingRequests from './Pages/PendingRequests/PendingRequests'
import Notifications from './Pages/Notifications/Notifications'
import ChatPage from './Pages/ChatPage'


const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route
          path='/'
          element={
            <UserProtectedRoute>
              <Home />
            </UserProtectedRoute>
          }
        />
        <Route
          path='/user/registration'
          element={<Registration />}
        />
        <Route
          path='/user/login'
          element={<Login />}
        />
        <Route
          path='/user/profile'
          element={
            <UserProtectedRoute>
              <UserProfile />
            </UserProtectedRoute>
          }
        />
        <Route
          path='/user/profile/update'
          element={
            <UserProtectedRoute>
              <UpdateProfile />
            </UserProtectedRoute>
          }
        />
        <Route
          path='/account-verification/code/send'
          element={
            <UserProtectedRoute>
              <SendVerifyOtp />
            </UserProtectedRoute>
          }
        />
        <Route
          path='/confirmation/code/verify'
          element={
            <UserProtectedRoute>
              <VerifyUserAccount />
            </UserProtectedRoute>
          }
        />
        <Route
          path='/application/users/list'
          element={
            <UserProtectedRoute>
              <UsersList />
            </UserProtectedRoute>
          }
        />
        <Route
          path='/user/post/section'
          element={
            <UserProtectedRoute>
              <Post />
            </UserProtectedRoute>
          }
        />
        <Route
          path='/user/profile/page/:id'
          element={
            <UserProtectedRoute>
              <UserProfilePageById />
            </UserProtectedRoute>
          }
        />
        <Route
          path='/connections'
          element={
            <UserProtectedRoute>
              <Connections />
            </UserProtectedRoute>
          }
        />
        <Route
          path='/followings'
          element={
            <UserProtectedRoute>
              <Followings />
            </UserProtectedRoute>
          }
        />
        <Route
          path='/followers'
          element={
            <UserProtectedRoute>
              <Followers />
            </UserProtectedRoute>
          }
        />
        <Route
          path='/pendingRequests'
          element={
            <UserProtectedRoute>
              <PendingRequests />
            </UserProtectedRoute>
          }
        />
        <Route
          path='/notifications'
          element={
            <UserProtectedRoute>
              <Notifications />
            </UserProtectedRoute>
          }
        />
        <Route 
          path='chat/page'
          element={
            <UserProtectedRoute>
              <ChatPage />
            </UserProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App