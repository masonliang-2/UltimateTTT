import { useState, useEffect } from 'react'
import { useWS } from '../../WebSocketProvider.jsx'

export function Matching({ onMatch }) {
    const [username2, setUsername2] = useState('')
    const [gameID, setGameID] = useState(0)

    const { sendJsonMessage, lastJsonMessage, readyState } = useWS();

    if(sendJsonMessage){
        console.log("sendJsonMessage is defined");
    }
    else{
        console.log("sendJsonMessage is NOT defined");
    }

    useEffect(() => {
        if (!lastJsonMessage) return;

        const msg = lastJsonMessage

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