import useWebSocket from 'react-use-websocket';
import React, { useState, useEffect , useRef } from 'react';
import { Board } from './components/Board/index.jsx';

export function Game() {
  /*
  const WS_URL = `ws://127.0.0.1:8000`
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: true,
    queryParams: { username },
    shouldReconnect: () => true,
  })

  useEffect(() => {
    if (!lastJsonMessage) return;

    // handle server messages here
    switch (lastJsonMessage) {
      case "Opponent disconnected":
        console.log("Opponent disconnected");
        break;
      case "You are Player 1":
        console.log("You are Player 1");
        break;
      case "You are Player 2":
        console.log("You are Player 2");
        break;
      case "You win":
        console.log("You win");
        break;
      case "You lose":
        console.log("You lose");
        break;
      default:
        console.warn("Unknown message:", lastJsonMessage);
    }
  }, [lastJsonMessage]); // runs every time a new message arrives

  const handleCellClick = ({ row, col }) => {
    sendJsonMessage({
      type: 'cell_click',
      row: row,
      col: col,
    });

  };
  */
  return (
    <main>
      <h1>Ultimate Tic Tac Toe</h1>
    </main>
  );
}