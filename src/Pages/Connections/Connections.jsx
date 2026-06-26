import React, { useContext, useState, useMemo } from 'react';
import "./Connections.css";
import { StoreContext } from '../../Context/AuthContext/AuthContext';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Connections = () => {
  const { connections } = useContext(StoreContext);
  const navigate = useNavigate();

  const [friendName, setFriendName] = useState("");

  const filteredConnections = useMemo(() => {
    if (!Array.isArray(connections)) return [];

    return connections.filter((connection) =>
      connection?.name?.toLowerCase().includes(friendName.toLowerCase())
    );
  }, [connections, friendName]);

  return (
    <div className='user-connections-section'>
      <div className='user-connections-section-div'>

        {/* HEADER */}
        <div className='user-connections-section-title-h4'>
          <h4 className='user-connections-title-h4'>Friends</h4>

          <input
            className='connection-user-input'
            type="text"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            placeholder='Search by name'
          />
        </div>

        {/* LIST */}
        {filteredConnections.length > 0 ? (
          <div className="connection-card-prelude">

            {filteredConnections.map((connection) => {
              const date = connection?.created_at
                ? new Date(connection.created_at)
                : null;

              return (
                <div key={connection._id} className="connection-card">

                  <div className='connection-image-section-part-div'>
                    {connection.image ? (
                      <img
                        className='connection-image-section-part'
                        src={connection.image}
                        alt={connection.name}
                      />
                    ) : (
                      <User className='connection-image-section-part' />
                    )}
                  </div>

                  <div className='connections-texts-and-timestamps'>
                    <div>
                      <h3>{connection.name}</h3>
                      <p>{connection.email}</p>
                    </div>

                    <div className='pure-connection-timestamps'>
                      <h3 className='pure-connection-timestamps-title-h3-since'>
                        Since
                      </h3>

                      {date && (
                        <p className='pure-connection-timestamps-title-p-since-1'>
                          {date.toLocaleDateString()}
                        </p>
                      )}

                      {date && (
                        <p className='pure-connection-timestamps-title-p-since-2'>
                          {date.toLocaleTimeString()}
                        </p>
                      )}
                    </div>

                    <div className='button-profile-bottom-part'>
                      <button
                        onClick={() =>
                          navigate(`/user/profile/page/${connection._id}`)
                        }
                        className='button-profile-bottom-part-connections'
                      >
                        Profile
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        ) : (
          <p>No connections yet ...</p>
        )}

      </div>
    </div>
  );
};

export default Connections;
