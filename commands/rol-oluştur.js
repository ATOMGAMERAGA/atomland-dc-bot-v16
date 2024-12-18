const { PermissionsBitField } = require("discord.js");
const db = require("croxydb")
module.exports = {
    name:"rol-oluştur",
    description: ' Yeni Bir Rol Oluşturursun!',
    type:1,
    options: [
        {
            name:"isim",
            description:"Oluşturulucak Rolün Adı!",
            type:3,
            required:true
        },
       
       
    ],
  run: async(client, interaction) => {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: "<a:arp:1318968419940569159> | Rolleri Yönet Yetkin Yok!", ephemeral: true})
    const isim = interaction.options.getString('isim')
   interaction.guild.roles.create({name: isim})
    interaction.reply({content: "<a:tik:1318968486671945840> | Başarıyla **"+isim+"** Rolü Oluşturuldu."})
}

};
