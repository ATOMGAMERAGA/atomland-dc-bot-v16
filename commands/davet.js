const { Client, EmbedBuilder, ButtonBuilder, ActionRow } = require("discord.js");
const Discord = require("discord.js")
module.exports = {
  name: "davet",
  description: " Botun davet linkini atar.",
  type: 1,
  options: [],

  run: async(client, interaction) => {

    const dvt = new Discord.ButtonBuilder().setLabel('Davet Linkim').setStyle('Link').setEmoji('1063843026482503739').setURL('https://discord.com/oauth2/authorize?client_id=1285893895804293226&scope=bot&permissions=27649375294');
	const destek = new Discord.ButtonBuilder().setLabel('Destek Sunucum').setStyle('Link').setEmoji('1044325557615202364').setURL('https://dc.atomland.xyz');
    const row = new Discord.ActionRowBuilder().addComponents(dvt).addComponents(destek)
    const embed = new EmbedBuilder()
    .setAuthor({ name: "Merhaba, Ben ATOMLAND!", iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })})
.setTitle("ATOMLAND'ı Davet Et!")
.setDescription(`<:Discord_Pixel_Emoji:1288881557087453194> | ATOMLAND'ı şimdi sunucuna davet et ve botun tadını çıkar!`)
.setColor('#2F3136')
.setTimestamp()
.setFooter({text: interaction.user.tag+" İstedi.", iconURL: interaction.user.displayAvatarURL({ dynamic: true })})

interaction.reply({ embeds: [embed], components:[row]});
  }  

};