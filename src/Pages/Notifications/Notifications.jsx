import React, { useContext } from 'react'
import "./Notifications.css"
import { StoreContext } from '../../Context/AuthContext/AuthContext'
import { User } from 'lucide-react'

const Notifications = () => {
  const { pendingRequests, acceptingFriendRequest } = useContext(StoreContext);

  return (
    <div>
      <div className='pendingRequest-notifications-h3'>
        <h3>Notifications</h3>
      </div>
      <div>
        {pendingRequests?.length > 0 ? 
        (
          <div className='pendingRequests-cards-full'>
            {pendingRequests?.map((pendingRequest,index)=>(
              <div className='pendingRequest-card-section' key={pendingRequest}>
                <div>
                  {pendingRequest?.user?.image ? (<div> <img className='pendingRequests-user-image' src={pendingRequest?.user?.image} alt="" /> </div>) : (<div> <User /> </div>)}
                </div>
                <div key={pendingRequest._id || index}>
                  <p>{pendingRequest?.user?.name}</p>
                  <p>{pendingRequest?.user?.email}</p>
                  <button onClick={()=>acceptingFriendRequest(pendingRequest?.user?._id)} className='accept-button-pendingRequests'>Accept</button>
                </div>
              </div>
            ))}
          </div>
        )
        :
        (
          <div>
            <p>No pending requests ...</p>
          </div>
        )  
      }
      </div>
    </div>
  )
}

export default Notifications