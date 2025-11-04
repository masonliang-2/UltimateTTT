import { useState, useEffect, useReducer } from 'react'
import { useWS } from '../../WebSocketProvider.jsx'

function reducer(state, action) {
    switch (action.type) {
        case 'GAME_FOUND':
            return {
                ...state,
                phase: 'found',
            };
        default:
            return state;
    }
}

export function Matching({ onMatch }) {
    const [username2, setUsername2] = useState('')
    const [gameID, setGameID] = useState(0)
    const [state, dispatch] = useReducer(reducer, { phase: 'idle' });             //useReducer: manages related states and complex state transitions

    const { sendJsonMessage, lastJsonMessage, readyState, subscribe, emit } = useWS();

    if(sendJsonMessage){
        console.log("sendJsonMessage is defined");
    }
    else{
        console.log("sendJsonMessage is NOT defined");
    }

    useEffect(() => {
        const unsubscribe_game_found = subscribe('game_found', (payload) => {
            console.log("(Client) Server game found:", payload);
            sendJsonMessage({ type: "player_game_start" });
            dispatch({ type: 'GAME_FOUND' });
        });
        const unsubscribe_game_start = subscribe('game_start', (payload) => {
            console.log("(Client) Server game start:", payload);
            onMatch(payload.gameID, payload.player1_name, payload.player2_name, payload.player1_or_2, payload.board, payload.turn, payload.nextBoard, payload.seq, payload.status, payload.validMoves);
        });
        return () => {
            unsubscribe_game_found(); //unsub
            unsubscribe_game_start(); //unsub
        };
    }, [subscribe, sendJsonMessage, onMatch]);

    let screen = null;
    if(state.phase === 'idle'){
        screen = <>
            <h1>Waiting for opponent...</h1>
            <form name="backForm" onSubmit={e => {
                e.preventDefault()
                sendJsonMessage({ type: "player_left_queue" });
                onMatch("", username2, gameID) 
            }}>
                <input type="submit" value="Back"/>
            </form>
        </>
    }
    else if(state.phase === 'found'){
        screen = <>
            <h1>Waiting for opponent...</h1>
            <h4>Game Found!</h4>
            <p>Loading...</p>
        </>
    }
    return <>{screen}</>
}