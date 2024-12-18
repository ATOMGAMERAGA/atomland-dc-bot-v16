const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb")
module.exports = {
  name: "hesap-koruma",
  description: " Hesap Koruma Sistemini Açıp Kapatırsın!",
  type: 1,
  options: [    
    {
    type: 3,
    name: "seçenek",
    description: "Sistemi kapatacak mısın yoksa açacak mısın?",
    required: true,
    choices: [
      {
        name: "Aç",
        value: "ac"
      },
      {
        name: "Kapat",
        value: "kapat"
      }
    ]
  },
],

  run: async(client, interaction) => {
    const { user, guild, options } = interaction;
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: "<a:arp:1318968419940569159> | Rolleri Yönet Yetkin Yok!", ephemeral: true})
    const hesapkorumaSystemTrue = options.getString("seçenek");
    const hesapkorumaSystem = db.fetch(`hesapkoruma_${interaction.guild.id}`)

   switch(hesapkorumaSystemTrue) {
    case "ac": {
      const hesapkorumaSystem = db.fetch(`hesapkoruma_${interaction.guild.id}`)
      const hesapkorumaSystemDate = db.fetch(`hesapkorumaDate_${interaction.guild.id}`)
      
      if (hesapkorumaSystem && hesapkorumaSystemDate) {
          const date = new EmbedBuilder()
          .setDescription(`<a:arp:1318968419940569159> | Bu sistem <t:${parseInt(hesapkorumaSystemDate.date / 1000)}:R> önce açılmış!`)
      
      return interaction.reply({ embeds: [date] })
      }

      db.set(`hesapkoruma_${interaction.guild.id}`, true)
      db.set(`hesapkorumaDate_${interaction.guild.id}`, { date: Date.now() })
      return interaction.reply({ content: "<a:tik:1318968486671945840> | Başarılı bir şekilde sistem açıldı!" });
    }

    case "kapat": {
      if(!hesapkorumaSystem) return interaction.reply({ content: "<a:arp:1318968419940569159> | Bu sistem zaten kapalı?" });

      db.delete(`hesapkoruma_${interaction.guild.id}`)
      db.delete(`hesapkorumaDate_${interaction.guild.id}`)
      return interaction.reply({ content: "<a:arp:1318968419940569159> | Başarılı bir şekilde sistem kapatıldı!" });
    }
  }

  }

};
