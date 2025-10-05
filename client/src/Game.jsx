import useWebSocket from 'react-use-websocket';
import React, { useState, useEffect , useRef } from 'react';
import { Board } from './components/board/index.jsx';

const renderUsersList = users => {
  return (
    <ul>
      {Object.keys(users).map(uuid => {
        return <li key={uuid}>{JSON.stringify(users[uuid])}</li>
      })}
    </ul>
  )
}


export function Game({ username }) {
  const WS_URL = `ws://127.0.0.1:8000`
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: true,
    queryParams: { username },
    shouldReconnect: () => true,
  })

  const [player, setPlayer] = useState(1); // 1 = player1, 2 = player2


  useEffect(() => {
    
  }, [])

  const handleCellClick = ({ row, col }) => {
    sendJsonMessage({
      type: 'cell_click',
      row: row,
      col: col,
      player: player
    });
    setPlayer(player === 1 ? 2 : 1); // Toggle player between 1 and 2

  };

  return (
    <main>
      <h1>Ultimate Tic Tac Toe</h1>
      {lastJsonMessage ? (
        <>
          {renderUsersList(lastJsonMessage)}
          <Board onCellClick={handleCellClick} />
        </>
      ) : (
        <p>Waiting for game state…</p>
      )}
    </main>
  );
}