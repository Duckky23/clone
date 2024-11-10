import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Kết nối tới server
const socket = io.connect('http://localhost:4000');

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  // Nhận tin nhắn từ server
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((prevMessages) => [...prevMessages, data]);
    });
  }, []);

  // Gửi tin nhắn tới server
  const sendMessage = () => {
    if (message !== '') {
      const messageData = {
        author: 'User', // Bạn có thể thay đổi để phù hợp với user hiện tại
        message: message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit('send_message', messageData);
      setMessageList((prevMessages) => [...prevMessages, messageData]);
      setMessage('');
    }
  };

  return (
    <div className="App" style={styles.app}>
      <div style={styles.chatWindow}>
        <div style={styles.chatHeader}><p>Live Chat</p></div>
        <div style={styles.chatBody}>
          {messageList.map((msg, index) => (
            <div key={index} style={msg.author === 'User' ? styles.myMessage : styles.otherMessage}>
              <p><strong>{msg.author}</strong> [{msg.time}]: {msg.message}</p>
            </div>
          ))}
        </div>
        <div style={styles.chatFooter}>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendButton}>Gửi</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  app: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f1f1f1',
  },
  chatWindow: {
    width: '400px',
    height: '500px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  chatHeader: {
    padding: '10px',
    backgroundColor: '#0078fe',
    color: '#fff',
    textAlign: 'center',
  },
  chatBody: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9',
  },
  chatFooter: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #eee',
  },
  input: {
    flex: 1,
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginRight: '10px',
  },
  sendButton: {
    padding: '8px 16px',
    backgroundColor: '#0078fe',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  myMessage: {
    textAlign: 'right',
    padding: '5px 10px',
    borderRadius: '10px',
    marginBottom: '5px',
    backgroundColor: '#daf8e3',
    marginLeft: 'auto',
    maxWidth: '80%',
  },
  otherMessage: {
    textAlign: 'left',
    padding: '5px 10px',
    borderRadius: '10px',
    marginBottom: '5px',
    backgroundColor: '#e8e8e8',
    maxWidth: '80%',
  },
};

export default ChatApp;
