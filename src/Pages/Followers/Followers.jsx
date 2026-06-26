import React, { useContext, useState, useMemo } from "react";
import "./Followers.css";
import { StoreContext } from "../../Context/AuthContext/AuthContext";
import { User } from "lucide-react";

const Followers = () => {
  const { followers = [] } = useContext(StoreContext);

  const [followersName, setFollowersName] = useState("");

  const filteredFollowerNames = useMemo(() => {
    return followers.filter((follower) =>
      (follower?.name || "")
        .toLowerCase()
        .trim()
        .includes(followersName.toLowerCase().trim())
    );
  }, [followers, followersName]);

  return (
    <div className="user-followings-section">
      <div className="user-followings-section-content">
        <div>
          <h3>Followers</h3>
        </div>

        <div>
          <input
            type="text"
            name="followersName"
            id="followersName"
            value={followersName}
            onChange={(e) => setFollowersName(e.target.value)}
            placeholder="Search by name"
          />
        </div>
      </div>

      {filteredFollowerNames.length > 0 ? (
        <div className="user-followings-section-div">
          {filteredFollowerNames.map((follower) => (
            <div key={follower._id} className="follower-card">
              {follower.image ? (
                <img
                  className="follower-image"
                  src={follower.image}
                  alt={follower.name}
                />
              ) : (
                <User className="follower-image" />
              )}

              <div className="follower-texts-timestamps-section">
                <div>
                  <h3>{follower.name}</h3>
                  <p>{follower.email}</p>
                </div>

                <div className="follower-div-section">
                  <p className="follower-div-section-p-1">
                    {new Date(follower.createdAt || follower.created_at)
                      .toLocaleString()
                      .substring(0, 10)}
                  </p>

                  <p className="follower-div-section-p-2">
                    {new Date(follower.createdAt || follower.created_at)
                      .toLocaleString()
                      .substring(11, 20)}
                  </p>
                </div>

                <div>
                  <button className="unfollow-section-btn">
                    Unfollow
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>No followers yet ...</p>
        </div>
      )}
    </div>
  );
};

export default Followers;
