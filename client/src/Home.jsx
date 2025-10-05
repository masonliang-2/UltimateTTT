import { Cursor } from './components/Cursor'
import useWebSocket from 'react-use-websocket';
import React, { useEffect, useRef } from 'react';
import throttle from "lodash.throttle"

const renderCursors = users => {
  return Object
    .keys(users)
    .map(uuid => {
      const user = users[uuid]
      return <Cursor 
        key={uuid} 
        userId={uuid} 
        point={[ user.state.x, user.state.y ]} />
    })
}

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

  const THROTTLE = 50
  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE))

  useEffect(() => {
    sendJsonMessage({
      x: 0, y: 0
    })
    window.addEventListener('mousemove', e => {
      sendJsonMessageThrottled.current({
        x: e.clientX,
        y: e.clientY
      })
    })
  }, [])

  useEffect(() => {
    console.log('readyState:', readyState); // 0/CONNECTING, 1/OPEN, 2/CLOSING, 3/CLOSED
  }, [readyState])


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