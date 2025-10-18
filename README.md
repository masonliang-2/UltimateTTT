Last update:
   React frontend Login and Matching pages working
   Matchmaking and beginning of game working
   considering: Game.jsx page, to handle people disconnecting when matchmaking, implement Game UI
      no duplicate enqueues
      check if both sockets are connected&OPEN before pairing

         If a socket closes before first move, requeue the survivor
         Heartbeat (ping/pong every 15–30s) to drop dead sockets fast
         Timeouts (e.g., if no first move within 10–20s, dissolve match)   
         persistance (redis) lol

Todo: 

   integrate the game logic (handleMessage on server index.js)
   implement message handling on client side (in Game.jsx)
