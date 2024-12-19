const { PermissionsBitField } = require("discord.js");
const db = require("croxydb")
module.exports = {
    name:"giriş-çıkış-kapat",
    description: ' Giriş Çıkış Sistemini kapatırsın!',
    type:1,
    options: [],
  run: async(client, interaction) => {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({content: "<a:arp:1318968419940569159> | Kanalları Yönet Yetkin Yok!", ephemeral: true})
   db.delete(`hgbb_${interaction.guild.id}`)
   interaction.reply("<a:tik:1318968486671945840> | Hoşgeldin Güle Güle Kanalı Başarıyla Sıfırlandı!")
}

};
