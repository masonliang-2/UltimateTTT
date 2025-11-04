//const { WebSocketServer } = require('ws')
//const http = require('http')
//const uuidv4 = require('uuid').v4
//const url = require('url')

import { WebSocketServer } from 'ws';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { parse as url } from 'url';

import { helperParseJson } from './Helpers/helpers.js';



const server = http.createServer()
const wsServer = new WebSocketServer({ server })

const port = 8000
const connections = new Map()
   //{playerId: connection}
const players = new Map()
   //{playerId: {name, gameID}
const games = new Map()
   //{gameID: {board, player1_id, player2_id, player1_name, player2_name, turn, nextBoard, seq, status, validMoves}}

let gameID = 0

const matching_queue = []

const delay = ms => new Promise(res => setTimeout(res, ms));




//message
/*
{
  type: 'player_move' or 'player_join_queue'
  content: whatever
}

{
  type: 'player_join_queue'
  content: 
}

Server -> Client
{
  "type": "board_state",
  
  "gameID": 42,
  "board": [[0,0,0], ...],        // 9x9
  "turn": 1,
  "nextBoard": 3,                    // 0..8 or null if free
  "seq": 7,
  "status": "playing",
  "validMoves": [{ "r":5, "c":7 }, { "r":5, "c":8 }]  // optional
}


Client -> Server
{ type:"player_move", 
  content: { "row":5, "col":7 }
}
*/
function sendGameFound(connection) {
  connection.send(JSON.stringify({
    type: "game_found",
  }));
}

function sendBoardState(connection, gameState, player_1_or_2, game_start = false) {
  const type = game_start ? "game_start" : "board_state";
  connection.send(JSON.stringify({
    type: type,
    gameID: gameState.gameID,
    player1_name: gameState.player1_name,
    player2_name: gameState.player2_name,
    player1_or_2: player_1_or_2,
    board: gameState.board,
    turn: gameState.turn,
    nextBoard: gameState.nextBoard,
    seq: gameState.seq,
    status: gameState.status,
    validMoves: gameState.validMoves
  }));
}

const handleMessage = async (bytes, playerId) => {
  const message = helperParseJson(bytes.toString());
  if (!message) return; // ignore invalid data

  const player = players[playerId]
  if (!player) return;

  console.log(`${player.name} Handling message: ${JSON.stringify(message)}`);
  const { type, content } = message;

  switch (type) {
    case 'player_join_queue':
      matching_queue.push(playerId)

      if (matching_queue.length >= 2) {
        gameID++
        const player1_id = matching_queue.shift()
        const player2_id = matching_queue.shift()
        players[player1_id].gameID = gameID
        players[player2_id].gameID = gameID
        const connection1 = connections[player1_id]
        const connection2 = connections[player2_id]
        games[gameID] = {
          player1_id: player1_id,
          player2_id: player2_id,
          board: Array.from({ length: 9 }, () => Array(9).fill(0)),
          turn: 1,
          nextBoard: null,
          seq: 0,
          status: "playing",
          validMoves: [],
        }
        if (connection1 && connection2) {
          sendGameFound(connection1);
          sendGameFound(connection2);
        }
      }
      break;

    case 'player_left_queue':
      if (matching_queue.includes(playerId)){
        matching_queue.splice(matching_queue.indexOf(playerId), 1)
      }
      break;

    case 'player_game_start':
      await delay(5000); // simulate loading time
      const game = players[playerId].gameID
      let current_player = null
      if(playerId === games[game].player1_id){
        current_player = 1;
      }
      else if (playerId === games[game].player2_id) {
        current_player = 2;
      }

      const game_state_start = {
          gameID: games[game].gameID,
          player1_id: games[game].player1_id,
          player2_id: games[game].player2_id,
          player1_name: players[games[game].player1_id].name,
          player2_name: players[games[game].player2_id].name,
          player1_or_2: current_player,
          board: Array.from({ length: 9 }, () => Array(9).fill(0)),
          turn: 1,
          nextBoard: null,
          seq: 0,
          status: "playing",
          validMoves: [
            { r: 0, c: 1 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 }, {r: 0, c: 5}, { r: 0, c: 6}, { r: 0, c: 7 }, { r: 0, c: 8 },
            { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 }, {r: 1, c: 5}, { r: 1, c: 6}, { r: 1, c: 7 }, { r: 1, c: 8 }, 
            { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 }, {r: 2, c: 5}, { r: 2, c: 6}, { r: 2, c: 7 }, { r: 2, c: 8 },
            { r: 3, c: 0 }, { r: 3, c: 1 }, { r: 3, c: 2 }, { r: 3, c: 3 }, { r: 3, c: 4 }, {r: 3, c: 5}, { r: 3, c: 6}, { r: 3, c: 7 }, { r: 3, c: 8 },
            { r: 4, c: 0 }, { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 }, {r: 4, c: 5}, { r: 4, c: 6}, { r: 4, c: 7 }, { r: 4, c: 8 },
            { r: 5, c: 0 }, { r: 5, c: 1 }, { r: 5, c: 2 }, { r: 5, c: 3 }, { r: 5, c: 4 }, {r: 5, c: 5}, { r: 5, c: 6}, { r: 5, c: 7 }, { r: 5, c: 8 },
            { r: 6, c: 0 }, { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, {r: 6, c: 5}, { r: 6, c: 6}, { r: 6, c: 7 }, { r: 6, c: 8 },
            { r: 7, c: 0 }, { r: 7, c: 1 }, { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, {r: 7, c: 5}, { r: 7, c: 6}, { r: 7, c: 7 }, { r: 7, c: 8 },
            { r: 8, c: 0 }, { r: 8, c: 1 }, { r: 8, c: 2 }, { r: 8, c: 3 }, { r: 8, c: 4 }, {r: 8, c: 5}, { r: 8, c: 6}, { r: 8, c: 7 }, { r: 8, c: 8 }
          ]
      };

      const connection = connections[playerId];
      if(connection){
        sendBoardState(connection, game_state_start, current_player, true);
      }
      break;
    }
}


const handleClose = playerId => {
  console.log(`(Server:) Handling close for playerId: ${playerId}`);
  /*
  console.log(`${players[playerId].name} disconnected`)
  const game = players[playerId].gameID
  delete connections[playerId]
  delete players[playerId]

  // Remove from matching queue if present
  if (matching_queue.includes(playerId)){
    matching_queue.splice(matching_queue.indexOf(playerId), 1)
  }
  // If no players are left, delete the game
  if (games[game].player1_id === playerId) {
      if (games[game].player2_id in players){
         connections[games[game].player2_id].send("Opponent disconnected")
      }
      else{
        delete games[game]
      }
  } 
  else {
      if (games[game].player1_id in players) {
         connections[games[game].player1_id].send("Opponent disconnected")
      }
      else{
        delete games[game]
      }
  }
  */
}

wsServer.on('connection', (connection, request) => {
  const fullUrl = new URL(request.url, `http://${request.headers.host}`);
  const username = fullUrl.searchParams.get('username');
  console.log(`${username} connected`)
  const playerId = uuidv4()
  connections[playerId] = connection

  players[playerId] = {
    name: username, 

  }

  connection.on('message', message => handleMessage(message, playerId));
  connection.on('close', () => handleClose(playerId));
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
})
