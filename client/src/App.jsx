import { useState } from 'react'
import { Login } from './components/Login/Login.jsx'
import { Game } from './components/Game/Game.jsx'

function App() {
  const [username, setUsername] = useState("")
  const [username2, setUsername2] = useState("")
  const [gameID, setGameID] = useState(0)

  if (username && username2 && gameID) {
    return <Game username1={username} username2={username2} gameID={gameID} />
  }
  else if (username) {
    return <Matching onMatch={(username2, gameID) => {
      setUsername2(username2)
      setGameID(gameID)
    }} />
  }
  else {
    return <Login onSubmit={setUsername} />
  }
  
}

export default App
