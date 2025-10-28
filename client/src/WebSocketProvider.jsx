// WebSocketContext.jsx
import { createContext, useContext } from "react";
import useWebSocket from "react-use-websocket";
import { helperParseJson } from './components/Helpers/helpers.jsx'

const WSContext = createContext(null);

export function WebSocketProvider({ url, children }) {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url, {
    share: true,
    shouldReconnect: () => true,
    reconnectAttempts: Infinity,
    reconnectInterval: 1500,
    onOpen: () => {
      console.log("Connected to server");
      sendJsonMessage({ type: "player_join_queue" });
    },
    onClose: () => console.log("WS closed"),
    onError: (e) => console.error("WS error", e),
    // Optional: handle *every* message here in one place.

    onMessage: (e) => {
      const data = helperParseJson(e.data);
      if (data) {
        console.debug("WS onMessage:", data);
      } else {
        console.debug("WS onMessage (non-JSON):", e.data);
      }
    }
  });

  // Expose only what you want children to depend on:
  const value = { sendJsonMessage, lastJsonMessage, readyState };
  return <WSContext.Provider value={value}>{children}</WSContext.Provider>;
}

export function useWS() {
  const context = useContext(WSContext);
  if (!context) throw new Error("useWS must be used within WebSocketProvider");
  return context;
}