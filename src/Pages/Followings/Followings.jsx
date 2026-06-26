import React, { useContext } from "react";
import "./Followings.css";
import { StoreContext } from "../../Context/AuthContext/AuthContext";
import { User } from "lucide-react";

const Followings = () => {
  const { followings = [] } = useContext(StoreContext);

  if (!followings) return <p>Loading followings...</p>;

  return (
    <div className="user-followings-section">
      {followings.length > 0 ? (
        <div className="user-followings-section-div-insides">
          {followings.map((following, index) => (
            <div
              key={following?._id || index}
              className="user-followings-sect-cornels"
            >
              <div className="user-followings-sect-cornels-insides">

                {/* IMAGE */}
                <div className="followings-image-full-section">
                  {following?.image ? (
                    <img
                      className="followings-image"
                      src={following.image}
                      alt={following.name || "User"}
                    />
                  ) : (
                    <User size={40} />
                  )}
                </div>

                {/* INFO */}
                <div className="followings-p-h3-text-section">
                  <h3 className="followings-name-h3">
                    {following?.name || "No Name"}
                  </h3>

                  <p className="followings-p-email">
                    {following?.email || "No Email"}
                  </p>

                  {/* SAFE TIMESTAMPS */}
                  {(following?.createdAt || following?.created_at) && (
                    <div className="followings-timestamps">
                      <p>
                        {new Date(
                          following.createdAt || following.created_at
                        ).toLocaleDateString()}
                      </p>

                      <p>
                        {new Date(
                          following.createdAt || following.created_at
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No followings yet ...</p>
      )}
    </div>
  );
};

export default Followings;
