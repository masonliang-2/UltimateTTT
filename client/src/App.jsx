import { useState } from 'react'
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

  // Open socket ONLY after username is set (i.e., after login)
  useEffect(() => {
    if (!username) return; // do nothing until they log in

    const ws = new WebSocket(`ws://localhost:8000?username=${username}`);
    setWsRef(ws);

    ws.onopen = () => {
      console.log("Connected to server");
      ws.send(JSON.stringify({ type: "player_join_queue" }));
    };

    ws.onmessage = (event) => {
      console.log("Received from server:", event.data);
      //const data = JSON.parse(event.data);
      //console.log("Received from server:", data);
      // handle match_found etc., and call setters as needed
      // e.g., if server sends { type: "match_found", opponent, gameID }
      // setUsername2(data.opponent); setGameID(data.gameID);
    };

    ws.onclose = () => console.log("Disconnected from server");

    // cleanup on username change or App unmount
    return () => {
      try { ws.close(); } catch {}
      setWsRef(null);
    };
  }, [username]);



  if (username && username2 && gameID) {
    return <Game username1={username} username2={username2} gameID={gameID} />
  }
  else if (username) {
    return <Matching ws={wsRef} onMatch={(username,username2, gameID) => {
      setUsername(username)
      setUsername2(username2)
      setGameID(gameID)
    }} />
  }
  else {
    return <Login onSubmit={setUsername} />
  }
  
}

export default App
