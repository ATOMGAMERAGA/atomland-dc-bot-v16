const { PermissionsBitField } = require("discord.js");
const db = require("croxydb")
module.exports = {
    name:"rol-al",
    description: ' Birinden Rol Alırsın!',
    type:1,
    options: [
        {
            name:"user",
            description:"Rolü alınıcak kullanıcıyı seçin!",
            type:6,
            required:true
        },
        {
            name:"rol",
            description:"Lütfen bir rol etiketle!",
            type:8,
            required:true
        },
       
       
    ],
  run: async(client, interaction) => {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: "<a:arp:1318968419940569159> | Rolleri Yönet Yetkin Yok!", ephemeral: true})
    const rol = interaction.options.getRole('rol')
    const user = interaction.options.getMember('user')
    interaction.guild.members.cache.get(user.id).roles.remove(rol)
    interaction.reply({content: "<a:tik:1318968486671945840> | Başarıyla <@"+user+"> Kullanıcısının <@&"+rol.id+"> Rolü Alındı!"})
}

};
