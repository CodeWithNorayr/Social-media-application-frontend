import React, { useContext } from 'react';
import "./PendingRequests.css";
import { StoreContext } from '../../Context/AuthContext/AuthContext';
import { User } from 'lucide-react';

const PendingRequests = () => {
  const { pendingRequests = [] } = useContext(StoreContext);

  return (
    <div className='user-pendingRequests-section'>
      <div className='user-pendingRequests-section-div'>

        {pendingRequests.length > 0 ? (
          pendingRequests.map((pendingRequest) => {
            const user = pendingRequest?.user;

            return (
              <div key={pendingRequest._id} className='pendingRequest-card'>

                {/* IMAGE OR DEFAULT ICON */}
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user?.name || "User"}
                    className="pendingRequest-image"
                  />
                ) : (
                  <User className="pendingRequest-icon" />
                )}

                {/* TEXT */}
                <div className="pendingRequest-text">
                  <h3>{user?.name || "Unknown User"}</h3>
                  <p>{user?.email || "No email"}</p>
                </div>

              </div>
            );
          })
        ) : (
          <p>No pending requests yet ...</p>
        )}

      </div>
    </div>
  );
};

export default PendingRequests;
