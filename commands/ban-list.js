const { Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ban-list",
  description: " Banlı Olan Kullanıcıları Görürsün!",
  type: 1,
  options: [],

  run: async(client, interaction) => {

    var userlist = interaction.guild.bans.fetch()
    userlist.then(collection => {
    if(collection.first() == null){
      
    const embed = new EmbedBuilder()
    .setDescription("Sunucunuzda Banlanan Kimse Yok!")      
    .setColor("Red")
    .setTitle("<a:arp:1318968419940569159> Hata!")
    interaction.reply({embeds: [embed]})
      
    } else {
    const data = collection.map(mr => "`"+mr.user.username+"`").slice(0, 60).join(", ")
    const embed2 = new EmbedBuilder()
    .setTitle("ATOMLAND - Ban List")
    .setColor("#ff0000")
    .setDescription(data)
    interaction.reply({embeds: [embed2]})
}

  })
}

};
