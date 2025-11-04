// WebSocketContext.jsx
import { createContext, useContext } from "react";
import useWebSocket from "react-use-websocket";
import { helperParseJson } from './components/Helpers/helpers.jsx'
import { useEffect, useRef, useCallback } from "react";


const WSContext = createContext(null);

export function WebSocketProvider({ url, children }) {

  const listenersRef = useRef(new Map()); // Map<type, Set<fn>>, or Map<type, queue_of_requests>       //useRef: store variable that persists across renders

  const subscribe = useCallback((type, fn) => {
    const set = listenersRef.current.get(type) ?? new Set();
    set.add(fn);
    listenersRef.current.set(type, set);
    return () => {
      set.delete(fn);
      if (!set.size) listenersRef.current.delete(type);
    };
  }, []);

  const emit = useCallback((type, payload) => {                                                     //useCallback: memoize function so it doesn't get recreated on every render
      listenersRef.current.get(type)?.forEach(fn => fn(payload));
      listenersRef.current.get('*')?.forEach(fn => fn({ type, payload })); // subscribe to all
  }, []);
  
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url, {                      //useWebSocket: special react websocket hook that gives sendJsonMessage, lastJsonMessage, readyState
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

    onMessage: (e) => {
      const data = helperParseJson(e.data);
      if (data) {
        console.debug("WS onMessage:", data);
      } else {
        console.debug("WS onMessage (non-JSON):", e.data);
      }
      if (!data?.type) return;
      emit(data.type, data);
    }
  });

  // Expose only what you want children to depend on:
  const value = { sendJsonMessage, lastJsonMessage, readyState, subscribe, emit };
  return <WSContext.Provider value={value}>{children}</WSContext.Provider>;
}

export function useWS() {
  const context = useContext(WSContext);
  if (!context) throw new Error("useWS must be used within WebSocketProvider");
  return context;
}