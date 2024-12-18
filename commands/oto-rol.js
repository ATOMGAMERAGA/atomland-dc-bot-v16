const { PermissionsBitField } = require("discord.js");
const db = require("croxydb")
module.exports = {
    name:"oto-rol",
    description: ' Yeni Gelenlere Otomatik Rol Verir!',
    type:1,
    options: [
        {
            name:"rol",
            description:"Lütfen bir rol etiketle!",
            type:8,
            required:true
        },
        {
            name:"bot-rol",
            description:"Lütfen bir rol etiketle!",
            type:8,
            required:true
        },
       
       
    ],
  run: async(client, interaction) => {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: "<a:arp:1318968419940569159> | Rolleri Yönet Yetkin Yok!", ephemeral: true})
    const rol = interaction.options.getRole('rol')
    const bot = interaction.options.getRole('bot-rol')
    db.set(`botrol_${interaction.guild.id}`, bot.id)
    db.set(`otorol_${interaction.guild.id}`, rol.id)
    interaction.reply({content: "<a:tik:1318968486671945840> | Otorol Başarıyla <@&"+rol+"> Olarak Ayarlandı. Bot rolü <@&"+bot+"> olarak ayarlandı."})
}

};
