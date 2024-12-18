const { Client, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js")
const { createButton, deleteMessageButton } = require("../function/functions");
module.exports = {
  name: "yardım",
  description: " Botun yardım menüsüne bakarsın!",
  type: 1,
  options: [],

  run: async(client, interaction) => {

    const embed = new EmbedBuilder()
    .setAuthor({ name: "ATOMLAND Yardım Menüsü", iconURL: client.user.displayAvatarURL({ dynamic: true })})
    .setTitle("・Hangi komutlarım hakkında bilgi almak istiyorsan o butona bas!")       .setDescription("\n\n**<a:Minecraft_enchanted_book:1284008792882810880> Linkler**\n> <:Discord_Pixel_Emoji:1288881557087453194>・**Botun davet linki: [Tıkla](https://discord.com/oauth2/authorize?client_id=1285893895804293226&scope=bot&permissions=27649375294)**\n> <a:redutility4:1284009023515136002>・**Botun destek sunucusu: [Tıkla](https://dc.atomland.xyz)**\n> <:newmember:1044325552007422052>")
    .setColor('Blue')
    const row1 = new Discord.ActionRowBuilder()

    .addComponents(
        new Discord.ButtonBuilder()
            .setEmoji("1039607060775571476")
            .setLabel("Moderasyon")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setCustomId("moderasyon_"+interaction.user.id)
    )

    .addComponents(
        new Discord.ButtonBuilder()
            .setEmoji("1039607052340834354")
            .setLabel("Kayıt")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setCustomId("kayıt_"+interaction.user.id)
    )

    .addComponents(
      new Discord.ButtonBuilder()
          .setEmoji("1039607059357913098")
          .setLabel("Kullanıcı")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setCustomId("kullanıcı_"+interaction.user.id)
  )
  .addComponents(
    new Discord.ButtonBuilder()
        .setEmoji("1039607040898781325")
        .setLabel("Sistemler")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId("sistemler_"+interaction.user.id)
)

  const row2 = new Discord.ActionRowBuilder()
  .addComponents(
            new Discord.ButtonBuilder()
            .setLabel("Koruma")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji("1044325545925672976")
            .setCustomId("korumasystem_"+interaction.user.id),
  )
  .addComponents(
    new Discord.ButtonBuilder()
        .setLabel("ㅤㅤㅤ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setDisabled(true)
        .setCustomId("süsbuton2")
  )
  .addComponents(
    new Discord.ButtonBuilder()
        .setLabel("Ana Sayfa")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1044325564636471397')
        .setDisabled(true)
        .setCustomId("anasayfa_"+interaction.user.id)
  )  
  .addComponents(
    new Discord.ButtonBuilder()
        .setLabel("ㅤㅤㅤ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setDisabled(true)
        .setCustomId("süsbuton3")
  )
  .addComponents(
    new Discord.ButtonBuilder()
        .setEmoji("1039607063443161158")
        .setLabel(" ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId(".clearMessageButton_"+interaction.user.id)
)
   
   interaction.reply({embeds: [embed], components: [row1, row2]}).then(msg => {
    msg.createMessageComponentCollector(user => user.clicker.user.id == interaction.user.id).on('collect', async (button) => {

   })
   })
  }  

};