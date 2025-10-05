const { WebSocketServer } = require('ws')
const http = require('http')
const uuidv4 = require('uuid').v4
const url = require('url')

const server = http.createServer()
const wsServer = new WebSocketServer({ server })

const port = 8000
const connections = {}
   //{uuid: connection}
const users = {}
   //{uuid: {username, gameID}
const games = {}
   //{gameID: {board, player1_uuid, player2_uuid}}

const matching_queue = []

let gameID = 0

let matching_count = 0

const handleMessage = (bytes, uuid) => {
  const message = JSON.parse(bytes.toString()) //only ever row and col
  const user = users[uuid]
  if (!user) return;
  console.log(`${user.username} Handling message: ${JSON.stringify(message)}`);
  const { row, col } = message;
  //update board state
}

const handleClose = uuid => {
  console.log(`${users[uuid].username} disconnected`)
  delete connections[uuid]
  delete users[uuid]
  if (matching_queue.includes(uuid)){
    matching_queue.splice(matching_queue.indexOf(uuid), 1)
    matching_count--
  }
  // If no players are left, delete the game
  const game = users[uuid].gameID
  if (games[game].player1_uuid === uuid) {
      if (games[game].player2_uuid in users){
         connections[games[game].player2_uuid].send("Opponent disconnected")
      }
  }
  else{
      if (games[game].player1_uuid in users){
         connections[games[game].player1_uuid].send("Opponent disconnected")
      }
  }
  if (game in games) {
      delete games[game]
  }
}


const broadcast_game_found = (uuid1, uuid2) => {
  const connection1 = connections[uuid1]
  const connection2 = connections[uuid2]
  if (connection1 && connection2) {
    connection1.send("You are Player 1")
    connection2.send("You are Player 2")
  }
}

wsServer.on('connection', (connection, request) => {
  const { username }  = url.parse(request.url, true).query
  console.log(`${username} connected`)
  const uuid = uuidv4()
  connections[uuid] = connection

  users[uuid] = {
    username,
  }

  matching_count++
  matching_queue.push(uuid)

  if (matching_count >= 2){
     gameID++
     const player1_uuid = matching_queue.shift()
     const player2_uuid = matching_queue.shift()
     matching_count -= 2
     users[player1_uuid].gameID = gameID
     users[player2_uuid].gameID = gameID
     games[gameID] = {
         board: Array.from({ length: 9 }, () => Array(9).fill(0)),
         player1_uuid,
         player2_uuid
     }
     broadcast_game_found(player1_uuid, player2_uuid)
  }
  connection.on('message', message => handleMessage(message, uuid));
  connection.on('close', () => handleClose(uuid));
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
})