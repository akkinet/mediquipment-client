const express = require('express');
const http = require('http');
const {Server} =  require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("update cart", (data) => {
    // console.log("server data: " + data);
    io.emit("update cart", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(1008, () => {
  console.log("Socket.IO server listening on port 1008");
});
