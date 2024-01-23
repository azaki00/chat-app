import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://192.168.1.103:8081');

const App = () => {
  const [userID, setUserID] = useState(socket.id);
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageInfo, setMessageInfo] = useState();
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const setUsername = () => {
      let username = prompt('Please enter a username:');
      socket.emit('set_username', username);  // Emit an event to set the username on the server
      setUserName(username);
    };

    setUsername();
  }, []);

  useEffect(() => {
    socket.on('receive_message', ({ text, username, timestamp }) => {
      setMessages((prevMessages) => [...prevMessages, { text: text, self: false, username: username, timestamp: timestamp }]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const timestampDateNow = () => {
    const currentDate = new Date();

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      socket.emit('send_message', { text: newMessage, username: userName, timestamp: timestampDateNow() });
      setMessages((prevMessages) => [...prevMessages, { text: newMessage, self: true, username: userName, timestamp: timestampDateNow() }]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <div id="application">
        <div style={{ height: `calc(100% - 50px)`, overflowY: 'scroll', background: `#EFE7DE url(https://cloud.githubusercontent.com/assets/398893/15136779/4e765036-1639-11e6-9201-67e728e86f39.jpg) repeat` }}>
          <div className="chat-app-header" style={{ top: 0, zIndex: 1000, position: 'sticky', fontWeight: 'bold', color: '#fff', fontSize: '1.3em', width: '100%', backgroundColor: '#14A687', boxShadow: '1px 2px 3px #00000050', }}>
            <span style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <span id="user-name" style={{ padding: "15px", width: "30%", textAlign: 'center' }}>
                {userName}
                <br />
                <span className="socketIdDisplay" style={{ color: "#efefef", fontSize: "8px" }}>
                  {socket.id}

                </span>
              </span>
              <span style={{ padding: "15px", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                CHAT APP
              </span>
            </span>
          </div>
          <div className="message-container">
            {messages.map((message, index) => (
              <div key={index} style={{ backgroundColor: message.self ? '#DAF9C6' : '#FFFFFF', padding: 10, borderRadius: 10, margin: 6, textAlign: message.self ? 'right' : 'left', boxShadow: '1px 1px 3px #00000030' }}>
                {message.self ? (<span><b>You</b> : {message.text}</span>) : (<span><b>{message.username}</b> : {message.text}</span>)}
                <br />
                <span style={{ color: "#434343", fontSize: "10px" }}> {message.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='inputs'>
          <input
            type="text"
            value={newMessage}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()} // Use onKeyDown for Enter key
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
            className="animated-input"
            style={{ outline: 'none', transition: '0.4s', borderRadius: 10, padding: 10, boxShadow: '1px 2px 3px #00000050' }}
          />
          <button
            onClick={sendMessage}
            className="button-chat"
            style={{ color: '#ffffff', borderRadius: '50%', padding: 6, boxShadow: '1px 2px 2px #00000050' }}
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
