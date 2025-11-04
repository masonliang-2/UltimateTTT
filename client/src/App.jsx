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
  const [boardState, setBoardState] = useState(null); // { gameID, player1_name, player2_name, board, ... }

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

  if(boardState){
    screen = <Game boardState = {boardState} onLogout={handleLogout} />;
  }
  else if(username){
    screen = <Matching
        onMatch={(gameID, player1_name, player2_name, player1_or_2, board, turn, nextBoard, seq, status, validMoves) => {
          setBoardState({ gameID, player1_name, player2_name, player1_or_2, board, turn, nextBoard, seq, status, validMoves });
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
