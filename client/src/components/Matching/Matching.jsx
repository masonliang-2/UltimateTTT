import { useState, useEffect } from 'react'

export function Matching({ sendJsonMessage, lastJsonMessage, readyState, onMatch }) {
    const [username2, setUsername2] = useState('')
    const [gameID, setGameID] = useState(0)

    useEffect(() => {
        if (!lastJsonMessage) return;

        // lastJsonMessage is already JSON-parsed by the hook
        const msg = lastJsonMessage;

        switch (msg.type) {
        case "board_state":
            console.log("Server updated board state:", msg);
            setUsername2(msg.player2_name);
            setGameID(msg.gameID);
            sendJsonMessage({ type: "player_game_found" });
            onMatch(msg.player1_name, msg.player2_name, msg.gameID);
            break;

        default:
            console.log("Unknown message:", msg);
        }
        
    }, [lastJsonMessage]);

    return (
        <>
            <h1>Waiting for opponent...</h1>
            <form name="backForm" onSubmit={e => {
                e.preventDefault()
                sendJsonMessage({ type: "player_left_queue" });
                onMatch("", username2, gameID) 
            }}>
                <input type="submit" value="Back"/>
            </form>
        </>
    )
}