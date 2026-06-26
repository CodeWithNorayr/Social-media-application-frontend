import React, { useContext } from "react";
import "./Notifications.css";
import { StoreContext } from "../../Context/AuthContext/AuthContext";
import { User } from "lucide-react";

const Notifications = () => {
  const { pendingRequests = [], acceptingFriendRequest } =
    useContext(StoreContext);

  return (
    <div>
      <div className="pendingRequest-notifications-h3">
        <h3>Notifications</h3>
      </div>

      <div>
        {pendingRequests.length > 0 ? (
          <div className="pendingRequests-cards-full">
            {pendingRequests.map((pendingRequest, index) => (
              <div
                className="pendingRequest-card-section"
                key={pendingRequest?._id || index}
              >
                {/* IMAGE */}
                <div>
                  {pendingRequest?.user?.image ? (
                    <img
                      className="pendingRequests-user-image"
                      src={pendingRequest.user.image}
                      alt={pendingRequest?.user?.name || "User"}
                    />
                  ) : (
                    <User />
                  )}
                </div>

                {/* INFO */}
                <div>
                  <p>{pendingRequest?.user?.name || "Unknown user"}</p>
                  <p>{pendingRequest?.user?.email || "No email"}</p>

                  <button
                    onClick={() =>
                      acceptingFriendRequest(
                        pendingRequest?.user?._id
                      )
                    }
                    className="accept-button-pendingRequests"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>No pending requests ...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
