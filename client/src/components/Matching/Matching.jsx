import { useState } from 'react'

export function Matching({ ws, onMatch }) {
    const [username2, setUsername2] = useState('')
    const [gameID, setGameID] = useState(0)

    return (
        <>
            <h1>Waiting for opponent...</h1>
            <form name="backForm" onSubmit={e => {
                e.preventDefault()
                ws.send(JSON.stringify({ type: "player_left_queue" }));
                onMatch("", username2, gameID) 
            }}>
                <input type="submit" value="Back"/>
            </form>
        </>
    )
}