// Importing required modules and components
import React, { useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';
import ChatRoomList from './components/ChatRoomList';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import LoginForm from './components/Login';
import SignupForm from './components/Signup';
import { AuthContext } from './components/AuthContext';  // Make sure the path is correct

// Initialize Socket.io client
const socket = io("http://localhost:8000");

// Main AppContent component
function AppContent() {
  // State variables
  const [rooms, setRooms] = useState(["General", "Sports", "Coding"]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const {
    isAuthenticated,
    setIsAuthenticated,
    setToken,
    token,
    username,
    setUsername,
  } = useContext(AuthContext);

  // useEffect to manage socket connection and message handling based on authentication status
  useEffect(() => {
    // Check if the user is authenticated
    if (isAuthenticated) {
      // Re-establish the socket connection if the user is authenticated
      socket.connect();

      // Event listener for successful socket connection
      socket.on("connect", () => {
        console.log("Connected to server"); // Log the successful connection for debugging
      });

      // Event listener for receiving new messages from the server
      socket.on("newMessage", (message) => {
        // Update the 'messages' state by appending the new message to the existing list
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Event listener for receiving a list of previous messages from the server
      socket.on("previousMessages", (previousMessages) => {
        // Update the 'messages' state with the list of previous messages
        setMessages(previousMessages);
      });
    } else {
      // If the user is not authenticated, disconnect the socket connection
      socket.disconnect();
    }

    // Cleanup logic to remove event listeners when the component is unmounted or when 'isAuthenticated' changes
    return () => {
      // Remove event listeners to prevent memory leaks and multiple instances
      socket.off("connect");
      socket.off("newMessage");
      socket.off("previousMessage");
    };
  }, [isAuthenticated]); // Dependency array: re-run the effect when 'isAuthenticated' changes

  const handlelogin = (token, username) => {
    localStorage.setItem("token", token);
    setToken(token);
    localStorage.setItem("username", username);
    setUsername(username);
    setIsAuthenticated(true);
  };

  const handleSignup = (token, username) => {
    localStorage.setItem("token", token);
    setToken(token);
    localStorage.setItem("username", username);
    setUsername(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setToken(null);
    setUsername(null);
    socket.disconnect();
  };

  const joinRoom = (room) => {
    setCurrentRoom(room);
    socket.emit("joinRoom", { room });
  };

  const sendMessage = (message) => {
    if (token) {
      const decodedToken = jwtDecode(token);

      const userId = decodedToken.userId;

      socket.emit("sendMessage", { room: currentRoom, message, userId });
    }
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <span>Welcome, {username}</span>
          <button onClick={handleLogout}>Logout</button>
          <ChatRoomList rooms={rooms} joinRoom={joinRoom} />
          {currentRoom && (
            <>
              <h1>Current Room: {currentRoom} </h1>
              <MessageList messages={messages} />
              <MessageInput sendMessage={sendMessage} />
            </>
          )}
        </>
      ) : (
        <>
          <h1>Login</h1>
          <LoginForm onLogin={handlelogin} />
          <h1>Signup</h1>
          <SignupForm onSignup={handleSignup} />
        </>
      )}
    </div>
  );
}

export default AppContent;
