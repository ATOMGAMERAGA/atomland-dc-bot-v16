require('dotenv').config();
const http = require('http');
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

// Sadece bu kullanıcı ID'sine sahip kişi komutları kullanabilsin
const ALLOWED_USER_ID = "1051072781284016198";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
});

client.on('messageCreate', async message => {
  // Sadece izin verilen kullanıcı komutları çalıştırabilsin
  if (message.author.id !== ALLOWED_USER_ID) return;

  if (message.content === '!ses') {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('Lütfen önce bir ses kanalına katılınız!');
    }
    
    // Botu ses kanalına, afk kalacak şekilde (selfMute & selfDeaf) katma
    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
      selfMute: true,
      selfDeaf: true
    });
    
    message.channel.send('Bot ses kanalına katıldı ve afk konumda bekliyor.');
  } else if (message.content === '!bb') {
    // Ses kanalındaki bot bağlantısını kapatma
    const connection = getVoiceConnection(message.guild.id);
    if (connection) {
      connection.destroy();
      message.channel.send('Bot ses kanalından ayrıldı.');
    } else {
      message.channel.send("Bot şu anda herhangi bir ses kanalında değil.");
    }
  } else if (message.content === '!ip') {
    // Sadece gülücük gönderme
    message.channel.send(':)');
  } else if (message.content === '!ping') {
    // !ping komutu: Ping değerini yanıt olarak gönderir.
    message.channel.send(`Ping: ${client.ws.ping}ms`);
  }
});

client.login(process.env.BOT_TOKEN);

// --- HTTP Sunucusu Başlatma ---
// Render.com ortamında kullanılan PORT ortam değişkenini kullanıyoruz.
const PORT = process.env.PORT || 443;
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("Bot is running!");
}).listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP sunucusu ${PORT} portunda çalışıyor.`);
});