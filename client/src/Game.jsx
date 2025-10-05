import useWebSocket from 'react-use-websocket';
import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    
  }, [])

  const handleCellClick = ({ row, col }) => {
    sendJsonMessage({
      type: 'cell_click',
      position: { row, col },
      player: username
    });
  };

  if (lastJsonMessage) {
    return <>
      {renderUsersList(lastJsonMessage)}
      <Board onCellClick={handleCellClick} />
    </>
  }
  if (!lastJsonMessage) {
    return (
      <main style={{ padding: 16 }}>
        <h1>Game</h1>
        <p>Logged in as <strong>{username}</strong>.</p>
        <p>Something is not working...no message was sent</p>
      </main>
    )
  }
}