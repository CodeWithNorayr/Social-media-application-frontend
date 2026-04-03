import React, { useContext, useState, useMemo } from 'react';
import "./Connections.css";
import { StoreContext } from '../../Context/AuthContext/AuthContext';
import { User } from 'lucide-react';

const Connections = () => {
  const { connections, navigate } = useContext(StoreContext);

  const [ friendName, setFriendName ] = useState("");

  

  const newFilteredFriendName = useMemo(() => {
    return connections?.filter((connection) =>
      connection.name?.toLowerCase().includes(friendName.toLowerCase())
    );
  }, [connections, friendName]);

  return (
    <div className='user-connections-section'>
      <div className='user-connections-section-div'>
        <div className='user-connections-section-title-h4'>
          <div>
            <h4 className='user-connections-title-h4'>Friends</h4>
          </div>
          <div>
            <input className='connection-user-input' type="text" name="friendName" id="friendName" value={friendName} onChange={(e)=>setFriendName(e.target.value)} placeholder='Search by name'/>
          </div>
        </div>

        {newFilteredFriendName?.length > 0 ? (
          <div className="connection-card-prelude">
            {newFilteredFriendName.map((connection) => (
              <div key={connection._id} className="connection-card">

                <div className='connection-image-section-part-div'>
                  {connection.image ? (
                    <img className='connection-image-section-part' src={connection.image} alt={connection.name} />
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
                    <div className='pure-connection-timestamps-title-h3'>
                      <h3 className='pure-connection-timestamps-title-h3-since'>Since</h3>
                    </div>
                    <div>
                      <p className='pure-connection-timestamps-title-p-since-1'>{new Date(connection.created_at).toLocaleString().substring(0, 10)}</p>
                      <p className='pure-connection-timestamps-title-p-since-2'>{new Date(connection.created_at).toLocaleString().substring(11, 22)}</p>
                    </div>
                  </div>
                  <div className='button-profile-bottom-part'>
                    <button onClick={()=>navigate(`/user/profile/page/${connection._id}`)} className='button-profile-bottom-part-connections'>Profile</button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>No connections yet ...</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Connections;