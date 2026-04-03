import React, { useContext } from 'react'
import "./PendingRequests.css"
import { StoreContext } from '../../Context/AuthContext/AuthContext'
import { User } from 'lucide-react'

const PendingRequests = () => {
  const { pendingRequests } = useContext(StoreContext)

  return (
    <div className='user-pendingRequests-section'>
      <div className='user-pendingRequests-section-div'>
        {pendingRequests?.length > 0 ? (
          pendingRequests.map((pendingRequest) => (
            <div key={pendingRequest._id} className='pendingRequest-card'>
              
              {/* IMAGE OR DEFAULT ICON */}
              {pendingRequest.user?.image ? (
                <img
                  src={pendingRequest.user.image}
                  alt={pendingRequest.user.name}
                  className="pendingRequest-image"
                />
              ) : (
                <User className="pendingRequest-icon" />
              )}

              {/* TEXT */}
              <div className="pendingRequest-text">
                <h3>{pendingRequest.user?.name}</h3>
                <p>{pendingRequest.user?.email}</p>
              </div>

            </div>
          ))
        ) : (
          <p>No pending requests yet ...</p>
        )}
      </div>
    </div>
  )
}

export default PendingRequests