const WebSocket = require('ws')
const zlib = require('zlib')
const config = require("./../config.json")

let ws = null
let inflator = null
let buffer = Buffer.alloc(0)

let onMessage = (payload) => { }
const setOnMessage = (cb) => (onMessage = cb)

function createInflator() {
  inflator = zlib.createInflate({ chunkSize: 65535 })

  inflator.on('data', (chunk) => {
    try {
      const payload = JSON.parse(chunk.toString())
      console.log('Mensaje recibido:', payload)
      onMessage(payload)
    } catch (e) {
      console.error('Error parseando JSON:', e)
    }
  })

  inflator.on('error', (err) => {
    console.error('Error en inflator:', err)
  })
}

function connect() {
  // limpiar buffer e inflator previos
  buffer = Buffer.alloc(0)
  if (inflator) inflator.close?.()
  createInflator()

  ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json&compress=zlib-stream')

  ws.on('open', () => {
    console.log('Conectado al gateway de Discord')

    const identifyPayload = config.userPayload
    ws.send(JSON.stringify(identifyPayload))

    // heartbeat o keepalive
    setInterval(() => {
      const payload = { op: 40, d: { seq: 9, qos: { active: true, ver: 26, reasons: ['foregrounded'] } } }
      ws.send(JSON.stringify(payload))
    }, 20000)
  })

  ws.on('message', (data) => {
    buffer = Buffer.concat([buffer, data])

    // Discord usa terminador 0x00 0x00 0xff 0xff para zlib-stream
    if (
      buffer.length >= 4 &&
      buffer[buffer.length - 4] === 0x00 &&
      buffer[buffer.length - 3] === 0x00 &&
      buffer[buffer.length - 2] === 0xff &&
      buffer[buffer.length - 1] === 0xff
    ) {
      inflator.write(buffer)
      buffer = Buffer.alloc(0)
    }
  })

  ws.on('close', (code, reason) => {
    console.log('Conexión cerrada. Código:', code, 'Razón:', reason.toString())
    reconnect()
  })

  ws.on('error', (err) => {
    console.error('Error WS:', err)
    reconnect()
  })
}

function reconnect() {
  console.log('Reintentando conexión en 1s...')
  setTimeout(() => {
    connect()
  }, 1000)
}

// iniciar conexión al cargar
connect()

module.exports = {
  setOnMessage
}
