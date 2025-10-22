import { useState } from 'react'
import useWebSocket from 'react-use-websocket';

import { Login } from './components/Login/Login.jsx'
import { Game } from './components/Game/Game.jsx'
import { Matching } from './components/Matching/Matching.jsx'


import { useEffect, useRef } from "react";


function App() {
  const [username, setUsername] = useState("")
  const [username2, setUsername2] = useState("")
  const [gameID, setGameID] = useState(0)
  
  // single socket that can live across screens
  const [wsRef, setWsRef] = useState(null);
  const [socketURL, setSocketURL] = useState(null);

  const handleLogin = (name) => {
    setUsername(name);
    setSocketURL(`ws://localhost:8000?username=${encodeURIComponent(name)}`);
  };


  const handleLogout = () => {
    // Close the socket by clearing the URL
    setSocketURL(null);
    setUsername("");
  };

  const {sendJsonMessage,lastJsonMessage,readyState} = useWebSocket(socketURL, {
    share: true,
    shouldReconnect: () => true,             // auto-reconnect
    reconnectAttempts: Infinity,
    reconnectInterval: 1500,
    onOpen: () => {
      console.log("Connected to server");
      sendJsonMessage({ type: "player_join_queue" });
    },
    onClose: () => console.log("WS closed"),
    onError: (e) => console.error("WS error", e),

    // Optional: handle *every* message here in one place.
    onMessage: (event) => {
      // This fires for ANY incoming message (string/binary).
      // If your server sends JSON, parse it:
      try {
        const data = JSON.parse(event.data);
        console.debug("WS onMessage:", data);
        // You can do quick/urgent side effects here if you want.
      } catch {
        console.debug("WS onMessage (non-JSON):", event.data);
      }
    }
  });
  

  if (username && username2 && gameID) {
    return <Game username1={username} username2={username2} gameID={gameID} />
  }
  else if (username) {
    return <Matching 
      sendJsonMessage={sendJsonMessage} 
      lastJsonMessage={lastJsonMessage} 
      readyState={readyState} 
      onMatch={(username,username2, gameID) => {
        setUsername(username)
        setUsername2(username2)
        setGameID(gameID)
      }} />
  }
  else {
    return <Login onSubmit={handleLogin} />
  }
  
}

export default App
