Last update:
   React frontend Login and Matching pages working
   considering: logic in server index.js, to handle people disconnecting when matchmaking . matchmaking logic overall
      make it FIFO instead of LIFO
      no duplicate enqueues
      check if both sockets are connected&OPEN before pairing
      create game before notifying

         If a socket closes before first move, requeue the survivor
         Heartbeat (ping/pong every 15–30s) to drop dead sockets fast
         Timeouts (e.g., if no first move within 10–20s, dissolve match)   
         persistance (redis) lol

Todo: 

   integrate the game logic (handleMessage on server index.js)
   implement message handling on client side (in Game.jsx)
   implement message handling on client side (in Matching.jsx)
   consider: Whether to store the board on the server only and let the user freely press moves everytime or precalculate all legal moves and send it to user instead
