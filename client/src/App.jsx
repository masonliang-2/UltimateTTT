import { useState } from 'react'
import useWebSocket from 'react-use-websocket';

import { Login } from './components/Login/Login.jsx'
import { Game } from './components/Game/Game.jsx'
import { Matching } from './components/Matching/Matching.jsx'

import { WebSocketProvider } from './WebSocketProvider.jsx'
import { helperParseJson } from './components/Helpers/helpers.jsx'

import { useEffect, useRef } from "react";


function App() {
  const [username, setUsername] = useState("")
  const [username2, setUsername2] = useState("")
  const [gameID, setGameID] = useState(0)
  
  // single socket that can live across screens
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

  let screen = null;

  if(username && username2 && gameID!= null){
    screen = <Game username1={username} username2={username2} gameID={gameID} onLogout={handleLogout} />
  }
  else if(username){
    screen = <Matching
        onMatch={(u1, u2, gid) => {
          setUsername(u1);       // optional: keep or ignore if you trust server
          setUsername2(u2);
          setGameID(gid);
        }}
      />
  }
  else{
    screen = <Login onSubmit={handleLogin} />
  }

  return (
    <WebSocketProvider url={socketURL}>
      {screen}
    </WebSocketProvider>
  );
  
}

export default App
