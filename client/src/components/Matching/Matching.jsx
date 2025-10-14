import { useState } from 'react'

export function Matching({ onMatch }) {
    const [username2, setUsername2] = useState('')
    const [gameID, setGameID] = useState(0)

    return (
        <>
            <h1>Waiting for opponent...</h1>
            <form name="backForm" onSubmit={e => {
                e.preventDefault()
                onMatch("", username2, gameID)
            }}>
                <input type="submit" value="Back"/>
            </form>
        </>
        //onMatch={() => setUsername2("Someone")}
        

    )
}