import useWebSocket from 'react-use-websocket';
import React, { useEffect, useRef } from 'react';

const renderUsersList = users => {
  return (
    <ul>
      {Object.keys(users).map(uuid => {
        return <li key={uuid}>{JSON.stringify(users[uuid])}</li>
      })}
    </ul>
  )
}

export function Home({ username }) {
  const WS_URL = `ws://127.0.0.1:8000`
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: true,
    queryParams: { username },
    shouldReconnect: () => true,
  })

  useEffect(() => {
    
  }, [])


  if (lastJsonMessage) {
    return <>
      {renderUsersList(lastJsonMessage)}
      {/* ideally batch updates */}
      {renderCursors(lastJsonMessage)}
    </>
  }
  if (!lastJsonMessage) {
    return (
      <main style={{ padding: 16 }}>
        <h1>Home</h1>
        <p>Logged in as <strong>{username}</strong>.</p>
        <p>Something is not working...</p>
      </main>
    )
  }
}