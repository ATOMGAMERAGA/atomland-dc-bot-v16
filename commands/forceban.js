const { PermissionsBitField } = require("discord.js");
const db = require("croxydb")
module.exports = {
    name:"forceban",
    description: ' ID ile kullanıcı yasaklarsın!',
    type:1,
    options: [
        {
            name:"id",
            description:"Lütfen bir kullanıcı ID girin!",
            type:3,
            required:true
        },
       
       
    ],
  run: async(client, interaction) => {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({content: "<a:arp:1318968419940569159> | Üyeleri Yasakla Yetkin Yok!", ephemeral: true})
    const id = interaction.options.getString('id')
  interaction.guild.members.ban(id).catch(() => {})
interaction.reply(id+ "<a:tik:1318968486671945840> | IDLI Kullanıcı Başarıyla Yasaklandı!")
}

};
