const { AttachmentBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "level-log",
  description: "Level logu ayarlarsın!",
  type: 1,
  options: [        
    {
      name: "kanal",
      description: "Level log kanalını ayarlarsın!",
      type: 7,
      required: true,
      channel_types: [0]
  },
],

  
  run: async(client, interaction, db, Rank, AddRank, RemoveRank) => {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({content: "<a:arp:1318968419940569159> | Kanalları Yönet Yetkin Yok!", ephemeral: true})
    const kanal2 = interaction.options.getChannel('kanal')
   db.set(`level_log_${interaction.guild.id}`, kanal2.id)
   interaction.reply("<a:tik:1318968486671945840> | Level log kanalı <#"+kanal2+"> olarak ayarlandı!")
}
};
