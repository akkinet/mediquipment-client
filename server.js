const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost", // Replace with your frontend's URL
    methods: ["GET", "POST"],
  },
});

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
  console.log("listening on *:1008");
});
