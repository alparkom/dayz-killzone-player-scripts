const express = require("express");
const http = require("http");
const https = require("https");
const { Server } = require("socket.io");
const fs = require("fs");

const options = {
  key: fs.readFileSync("./../cert/key.pem"),
  cert: fs.readFileSync("./../cert/cert.pem")
};

const app = express();
const server = https.createServer(options, app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

server.listen(443, () => {
  console.log("Servidor escuchando en :443");
});

module.exports = {
  io,
  server,
  app
}
