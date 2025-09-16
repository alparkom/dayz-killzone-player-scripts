const WebSocket = require('ws')
const zlib = require('zlib')

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

  const identifyPayload = {
    op: 2,
    d: {
      token: 'MTQxMTU0ODQ3MTE2ODczMzIxNQ.GspDYw.bj07JVUKhGnjZVQSTooFeb0vtWn_HB49i1MNvA',
      capabilities: 1734653,
      properties: {
        os: 'Windows',
        browser: 'Chrome',
        device: '',
        system_locale: 'en-US',
        browser_user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        browser_version: '139.0.0.0',
        os_version: '10',
        referrer: '',
        referring_domain: '',
        referrer_current: '',
        referring_domain_current: '',
        release_channel: 'stable',
        client_build_number: 440373,
        client_event_source: null,
        has_client_mods: false,
        client_launch_id: 'b2a66535-da31-4839-9806-65f6fe08308b',
        launch_signature: '370164ef-27eb-4053-9b78-08b2f038c191',
        client_heartbeat_session_id: 'f72eac14-633b-41fc-9b91-92d26092b9d8',
        client_app_state: 'focused',
        is_fast_connect: false,
        gateway_connect_reasons: 'AppSkeleton',
      },
      presence: { status: 'unknown', since: 0, activities: [], afk: false },
      compress: true,
      client_state: { guild_versions: {} },
    },
  }

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