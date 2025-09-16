const utils = require("./utils")
const writeDiscord = require("./write-discord")
const extraDiscord = require("./extra-discord")
const extraServer = require("./extra-server")
const readDiscord = require("./read-discord")
const config = require('./../config.json');

writeDiscord.setOnConnect(() => {
  readDiscord.setOnMessage(OnMessage)
})

function OnMessage(payload) {
  try {
    if (payload.t === "MESSAGE_CREATE" && payload.d.channel_id === config.killZone.killfeedChannelId) {
      OnMessageKillfeed(payload)
    }
  }
  catch (err) {
    console.error('Error leyendo el payload:', err);
  }
}

function OnMessageKillfeed(payload) {
  console.log("payload", payload)
  const message = payload.d.embeds[0].description
  const isHeadshot = payload.d.embeds[0].color === 16763904

  const data = utils.ParseKillData(message)

  if (!data) {
    console.log('Mensaje no reconocido:', message);
    return;
  }

  const realData = { ...data, isHeadshot }

  extraDiscord.SendMessageToDiscord(realData)
  extraServer.SendMessageToOverlay("killfeed", realData)
}
