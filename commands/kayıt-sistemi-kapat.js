const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb")
const Discord = require("discord.js")
module.exports = {
    name: "kayıt-sistemi-kapat",
    description: " Kayıt sistemini kapatırsın!",
    type: 1,
    options: [],
    // 
    run: async (client, interaction) => {

        const { user, customId, guild } = interaction;
        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("<a:arp:1318968419940569159> | Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        const basarili = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`<a:tik:1318968486671945840> | __**Kayıt Sistemi**__ başarıyla sıfırlandı!`)
            db.delete(`kayıtsistemi_${interaction.guild.id}`)
			db.delete(`kayıtsistemiDate_${interaction.guild.id}`)

            
        return interaction.reply({ embeds: [basarili], ephemeral: true }).catch((e) => { })

    }

};