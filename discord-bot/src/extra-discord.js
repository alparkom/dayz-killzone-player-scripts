const writeDiscord = require("./write-discord")

function SendMessageToDiscord(data) {
  const prefixToDiscord = GetPrefixToDiscord(data)
  const messageToDiscord = GenerateMessageToDiscord(data)
  const realMessage = `${prefixToDiscord} ${messageToDiscord}`

  writeDiscord.sendMessage(realMessage)
  console.log('realMessage', realMessage)
}

function GenerateMessageToDiscord(data) {
  const humanReasonToDiscord = GetHumanReasonToDiscord(data)
  let message = ``

  if (data.victimName) {
    message += `${data.victimName} ${humanReasonToDiscord}`
  }

  if (data.killerName) {
    message += ` por ${data.killerName}`
  }

  if (data.weaponName) {
    message += ` con ${data.weaponName}`
  }

  if (data.distance) {
    message += ` desde ${data.distance} metros`
  }

  message += `.`

  return message
}

function GetPrefixToDiscord(data) {
  let prefix = ""

  if (data.killerName && data.killerName.toUpperCase().includes('[ALA]')) {
    prefix += '🤯'
  } else if (data.victimName && data.victimName.toUpperCase().includes('[ALA]')) {
    prefix += '🤦'
  } else if (data.killerName && data.killerName.toUpperCase().includes('[CL]')) {
    prefix += '😬'
  } else if (data.victimName && data.victimName.toUpperCase().includes('[CL]')) {
    prefix += '😢'
  } else {
    prefix += '💤'
  }

  prefix += data.isHeadshot ? '💀' : '💥'

  return prefix
}

function GetHumanReasonToDiscord(data) {
  if (data.reason === "murder-by-player") {
    return "fue asesinado"
  }

  if (data.reason === "suicide") {
    return "se suicidó"
  }

  if (data.reason === "dehydrated") {
    return "se murió deshidratado"
  }

  if (data.reason === "inanition") {
    return "se murió de inanición"
  }

  if (data.reason === "murder-by-zombie") {
    return "fue asesinado por un zombie"
  }

  if (data.reason === "murder-by-animal") {
    return `fue asesinado por un animal (${data.killerName})`
  }

  if (data.reason === "died-by-weapon") {
    return `se murió por (${data.weaponName})`
  }

  return "se murió de manera desconocida"
}

module.exports = {
  SendMessageToDiscord,
}