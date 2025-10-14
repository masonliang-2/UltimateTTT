//const { WebSocketServer } = require('ws')
//const http = require('http')
//const uuidv4 = require('uuid').v4
//const url = require('url')

import { WebSocketServer } from 'ws';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { parse as parseUrl } from 'url';

const server = http.createServer()
const wsServer = new WebSocketServer({ server })

const port = 8000
const connections = new Map()
   //{playerId: connection}
const players = new Map()
   //{playerId: {name, gameID}
const games = new Map()
   //{gameID: {board, player1_id, player2_id}}

const matching_queue = []


//message
/*
{
  type: 'player_move' or 'player_connect'
  content: whatever
}

*/
const handleMessage = (bytes, playerId) => {
  const message = JSON.parse(bytes.toString()) //only ever row and col
  const player = players[playerId]
  if (!player) return;
  console.log(`${player.name} Handling message: ${JSON.stringify(message)}`);
  const { row, col } = message;
  //update board state
}
/*
const handleClose = playerId => {
  console.log(`${players[playerId].name} disconnected`)
  delete connections[playerId]
  delete players[playerId]
  if (matching_queue.includes(playerId)){
    matching_queue.splice(matching_queue.indexOf(playerId), 1)
  }
  // If no players are left, delete the game
  const game = players[playerId].gameID
  if (games[game].player1_id === playerId) {
      if (games[game].player2_id in players){
         connections[games[game].player2_id].send("Opponent disconnected")
      }
  }
  else{
      if (games[game].player1_id in players){
         connections[games[game].player1_id].send("Opponent disconnected")
      }
  }
  if (game in games) {
      delete games[game]
  }
}
*/
/*
const broadcast_game_found = (playerId1, playerId2) => {
  const connection1 = connections[playerId1]
  const connection2 = connections[playerId2]
  if (connection1 && connection2) {
    connection1.send("You are Player 1")
    connection2.send("You are Player 2")
  }
}
*/
wsServer.on('connection', (connection, request) => {
  const { name }  = url.parse(request.url, true).query
  console.log(`${name} connected`)
  const playerId = uuidv4()
  connections[playerId] = connection

  players[playerId] = {
    name,

  }
  /*
  matching_count++
  matching_queue.push(playerId)

  if (matching_count >= 2){
     gameID++
     const player1_id = matching_queue.shift()
     const player2_id = matching_queue.shift()
     matching_count -= 2
     players[player1_id].gameID = gameID
     players[player2_id].gameID = gameID
     games[gameID] = {
         board: Array.from({ length: 9 }, () => Array(9).fill(0)),
         player1_id,
         player2_id
     }
     broadcast_game_found(player1_id, player2_id)
  }
  */
  connection.on('message', message => handleMessage(message, playerId));
  connection.on('close', () => handleClose(playerId));
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
})
/*

connection.on('message', message =>
  if(message.type === 'player_move'){
    handleMessage(message, playerId, gameID )
  }
  else if (message.type === 'player_connect'){
    handleMessage(message, playerId));
  }
  else if (message.type === 'player_game_found'){
    players[playerId].gameID = message.gameID
    handleMessage(message, playerId));
  }

*/