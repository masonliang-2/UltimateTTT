import { useState } from 'react'
import { Login } from './components/Login.jsx'
import { Game } from './Game.jsx'

function App() {
  const [username, setUsername] = useState("")

  return (
      username ? (
        <Game username={username} />
      ) : (
        <Login onSubmit={setUsername} />
      )
  )
}

export default App
