const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb")
const Discord = require("discord.js")
module.exports = {
    name: "destek-sistemi",
    description: " Destek sistemini ayarlarsın!",
    type: 1,
    options: [
        {
            name: "kanal",
            description: "Destek mesajının atılacağı kanalı ayarlarsın!",
            type: 7,
            required: true,
            channel_types: [0]
        },
        {
            name: "log-kanalı",
            description: "Destek kapatıldığında mesaj atılacacak kanalı ayarlarsın!",
            type: 7,
            required: true,
            channel_types: [0]
        },
        {
            name: "yetkili-rol",
            description: "Destek yetkilisini ayarlarsın!",
            type: 8,
            required: true,
        },
    ],
    // 
    run: async (client, interaction) => {

        const { user, customId, guild } = interaction;
        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("<a:arp:1318968419940569159> | Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const ticketkanal = interaction.options.getChannel('kanal')
        const logkanal = interaction.options.getChannel('log-kanalı')
        const rol = interaction.options.getRole('yetkili-rol')

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })
			
		        const ticketSystem = db.fetch(`ticketSystem_${interaction.guild.id}`)
        const ticketSystemDate = db.fetch(`ticketSystemDate_${interaction.guild.id}`)
        
        if (ticketSystem && ticketSystemDate) {
            const date = new EmbedBuilder()
            .setDescription(`<a:arp:1318968419940569159> | Bu sistem <t:${parseInt(ticketSystemDate.date / 1000)}:R> önce açılmış!`)
        
        return interaction.reply({ embeds: [date] })
        }

        const category = await guild.channels.create({
            name: 'ATOMLAND Ticket',
            type: Discord.ChannelType.GuildCategory,
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: [Discord.PermissionsBitField.Flags.ViewChannel],
              },
            ],
          });    

        const basarili = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`<a:tik:1318968486671945840> | __**Destek Sistemi**__ başarıyla ayarlandı!\n\n<a:ZippyRiri_Utility:1284009110320320555> Destek Kanalı: ${ticketkanal}\n<a:ZippyRiri_Utility:1284009110320320555> Log Kanalı: ${logkanal}\n<:Discord_Pixel_Emoji:1288881557087453194> Yetkili Rolü: ${rol}`)
            db.set(`ticketKanal_${interaction.guild.id}`, logkanal.id)
            db.set(`ticketSystem_${interaction.guild.id}`, { yetkili: rol.id, ticketchannel: ticketkanal.id })
            db.set(`ticketCategory_${interaction.guild.id}`, { category:  category.id, log: logkanal.id });
			db.set(`ticketSystemDate_${interaction.guild.id}`, { date: Date.now() })

            const menu = new Discord.EmbedBuilder()
            .setColor("000000")
            .setTitle("<a:AUtilityPoint:1284009114699038833> | Destek talebi nasıl açabilirim?")
            .setDescription("> Aşağıdaki **Destek Talebi Oluştur** butonuna basarak destek talebi oluşturabilirsin!")
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setFooter({ text: "ATOMLAND Destek" })
  
        const row11 = new Discord.ActionRowBuilder()
  
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("1044325577064190033")
                    .setLabel("Destek Talebi Oluştur")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId("ticketolustur_everyone"),
                new Discord.ButtonBuilder()
                    .setEmoji("1039607065045385256")
                    .setLabel("Nasıl oluşturabilirim?")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId("ticketnasilacilir_everyone")
            )

            ticketkanal.send({ embeds: [menu], components: [row11] })
        return interaction.reply({ embeds: [basarili], ephemeral: true }).catch((e) => { })

    }

};
