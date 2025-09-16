const server = require("./server")

function SendMessageToOverlay(channel, data) {
  server.io.emit(channel, data)
}

module.exports = {
  SendMessageToOverlay
}