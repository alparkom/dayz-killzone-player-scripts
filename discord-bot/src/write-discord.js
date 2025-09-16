const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./../config.json');

let onConnect = () => { }
const setOnConnect = (cb) => onConnect = cb

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`Bot listo: ${client.user.tag}`);
  onConnect()
});

client.login(config.token);

async function sendMessage(message) {
  try {
    const channelId = config.allowedChannels[0];
    if (!channelId) {
      console.log('No hay un canal definido en config.');
      return;
    }

    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      console.log('No se pudo encontrar el canal o no es un canal de texto.');
      return;
    }

    await channel.send(message);
    console.log(`Mensaje enviado a ${channelId}: ${message}`);
  } catch (err) {
    console.error('Error enviando mensaje:', err);
  }
}

module.exports = { sendMessage, setOnConnect };
