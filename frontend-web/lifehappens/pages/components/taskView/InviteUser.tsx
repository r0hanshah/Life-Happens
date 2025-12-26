import React, { useState } from 'react';
import axios from 'axios';

const InviteUser = ({ taskId, inviterId }: { taskId: string; inviterId: string }) => {
  const [email, setEmail] = useState('');
  const [addClicked, setAddClicked] = useState(false);

  const handleSubmit = async () => {
    console.log('Invite button clicked'); // Debugging statement
    try {
      const response = await axios.post('http://127.0.0.1:5000/invite', { email, taskId, inviterId });
      console.log('Response:', response.data); // Debugging statement
      alert(response.data.message);
    } catch (error) {
      console.error('Error:', error); // Debugging statement
      alert('Error sending invitation');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#303030',
      padding: 10,
      borderRadius: 20,
      minWidth: 40,
      minHeight: 40,
      alignItems: 'center',
    }}>
      {addClicked && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 10,
        }}>
          <input
            placeholder="Invite User by Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 20,
              padding: 5,
              color: 'gray',
              marginRight: 10,
              backgroundColor: 'transparent',
            }}
          />

          <button
            style={{
              backgroundColor: '#717171',
              padding: '8px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              fontSize: 12,
              fontFamily: 'Arial, sans-serif',
            }}
            onClick={handleSubmit}
          >
            Send Invite
          </button>
        </div>
      )}

      <button
        onClick={() => {
          setAddClicked(!addClicked);
        }}
        style={{
          padding: 10,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <img
          src={require('../../assets/x_mark_white.png')}
          style={{
            width: 10,
            height: 10,
            transform: addClicked ? 'rotate(0deg)' : 'rotate(45deg)',
            opacity: 0.7,
          }}
        />
      </button>
    </div>
  );
};

export default InviteUser;
