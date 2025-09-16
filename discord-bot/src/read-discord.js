const WebSocket = require('ws')
const zlib = require('zlib')
const config = require("./../config.json")

const ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json&compress=zlib-stream')

let inflator = zlib.createInflate({ chunkSize: 65535 })
let buffer = Buffer.alloc(0)

let onMessage = (payload) => { }
const setOnMessage = (cb) => onMessage = cb

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

ws.on('message', (data) => {
  buffer = Buffer.concat([buffer, data])

  if (buffer.length >= 4 && buffer[buffer.length - 4] === 0x00 && buffer[buffer.length - 3] === 0x00 && buffer[buffer.length - 2] === 0xff && buffer[buffer.length - 1] === 0xff) {
    inflator.write(buffer)
    buffer = Buffer.alloc(0)
  }
})

ws.on('open', () => {
  console.log('Conectado al gateway de Discord')

  const identifyPayload = config.userPayload;

  ws.send(JSON.stringify(identifyPayload))

  setInterval(() => {
    const payload = { op: 40, d: { seq: 9, qos: { active: true, ver: 26, reasons: ['foregrounded'] } } }

    ws.send(JSON.stringify(payload))
  }, 20000)
})

ws.on('close', (code, reason) => {
  console.log('Conexión cerrada. Código:', code, 'Razón:', reason.toString());
});
ws.on('error', (err) => console.error('Error WS:', err))

module.exports = {
  setOnMessage
}