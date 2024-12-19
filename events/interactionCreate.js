const { Collection, ButtonStyle, EmbedBuilder } = require("discord.js");
const db = require("croxydb");
const Discord = require("discord.js");
const edb = require("croxydb")
const { readdirSync } = require("fs");
const Rank = require("../func/Rank.js");
const AddRank = require("../func/AddRank.js")
const { createButton, deleteMessageButton } = require("../function/functions");
const RemoveRank = require("../func/RemoveRank.js")
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionsBitField } = require('discord.js');
const moment = require("moment");
  require("moment-duration-format");
  const os = require("os");

module.exports =  {
name: Discord.Events.InteractionCreate,

  run: async(client, interaction) => {
  if(interaction.isChatInputCommand()) {

    if (!interaction.guildId) return;

    readdirSync('./commands').forEach(f => {

      const cmd = require(`../commands/${f}`);

      if(interaction.commandName.toLowerCase() === cmd.name.toLowerCase()) {

		console.log(`Komut kullandı: ${interaction.user.tag} (${interaction.user.id}) (${interaction.guild.name}) `)

        const btn = createButton(interaction, {
          id: `${interaction.user.id}`, // Butonu kullanacak olan kişinin ID'si. //Eğer buraya id yerine "everyone" yazarsan herkes kullanabilir.
          id_name: `rulesClick`, // Butonun idsi.
          label: `Kabul Ediyorum.`, //Butonun ismi.
          emoji: "<a:tik:1318968486671945840>",
          style: ButtonStyle.Danger //Butonun stili.
        })

        const rulesisread = db.fetch(`rulesisread_${interaction.user.id}`);
        const rulesizd = db.fetch(`rulesize`)
        if(!rulesisread) {
          const embed = new EmbedBuilder()
          .setAuthor({ name: `Kuralları kabul eden kişi sayısı: ${rulesizd}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
          .setTitle("> <a:AUtilityPoint:1284009114699038833>・Kuralları kabul etmek için **Kabul Ediyorum.** butonuna tıklayın!\n> ・Ama bunu yapmadan önce bi linklere göz atmanı isterim!")
          .setDescription("\n\n**<a:Minecraft_enchanted_book:1284008792882810880> Linkler**\n> ・**Botun kullanım koşulları: [Tıkla](https://github.com/ATOMGAMERAGA/atomland-terms-of-services)**\n>・**Botun gizlilik politikası: [Tıkla](https://github.com/ATOMGAMERAGA/atomland-terms-of-services)**")
          .setColor('Blue')
          return interaction.reply({ embeds: [embed], components: [btn], ephemeral: true })
        }

       return cmd.run(client, interaction, db, Rank, AddRank, RemoveRank);

      }


    });



  }

  if(interaction.isButton()) {
    const customId = interaction.customId;
    const name = customId.split("_")[0];
    const id = customId.split("_")[1];

    const idFind = (id_name) => {
      return `${id_name}_${id}`;
    } 

    if(id !== "everyone" && id !== interaction.user.id) {
      const butonembed = new Discord.EmbedBuilder()
      .setDescription(`Bu butonu sadece komutu yazan kişi kullanabilir!`)
      return interaction.reply({ embeds: [butonembed], ephemeral: true })
    }

    if(interaction.customId === idFind(".clearMessageButton")) {
      return interaction.message.delete();
    }

    if(interaction.customId === idFind("rulesClick")) {
      db.set(`rulesisread_${interaction.user.id}`, true)
      db.add(`rulesize`, 1);      
      const rulesizd = db.fetch(`rulesize`)
      const row = new Discord.ActionRowBuilder()
      .addComponents(
  new Discord.ButtonBuilder()
  .setLabel("Kabul Ediyorum.")
  .setStyle(Discord.ButtonStyle.Danger)
  .setEmoji("<a:tik:1318968486671945840>")
  .setDisabled(true)
  .setCustomId("ooeoeo"))
      const embed = new EmbedBuilder()
      .setAuthor({ name: `Senin ile kuralları kabul eden kişi sayısı: ${rulesizd}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
      .setTitle("<a:ZippyRiri_Utility:1284009110320320555>・Kuralları kabul ettiğin için teşekkürler artık bu komutun tadını çıkarabilirsin!")
      .setColor('Blue')
      return interaction.update({ embeds: [embed], components: [row], ephemeral: true })
    }

    if(interaction.customId === idFind("kayitol")) {
      const kayitmodel = new ModalBuilder()
      .setCustomId('kayitform')  
      .setTitle('ATOMLAND - Kayıt Menüsü!')
        const isim = new TextInputBuilder()
        .setCustomId('kayitisim')
        .setLabel('isim')
        .setStyle(TextInputStyle.Paragraph) 
        .setMinLength(2)
        .setPlaceholder('İsminiz Nedir?')
        .setRequired(true)
        const yas = new TextInputBuilder() 
        .setCustomId('kayityas')
        .setLabel('yaş')
        .setStyle(TextInputStyle.Paragraph)  
        .setMinLength(1)
        .setPlaceholder('Yaşınız Kaçtır?')
        .setRequired(true)
        
          const kayitisimrow = new ActionRowBuilder().addComponents(isim);
          const kayityasrow3 = new ActionRowBuilder().addComponents(yas);
          kayitmodel.addComponents(kayitisimrow, kayityasrow3);
          
          await interaction.showModal(kayitmodel);
    }
  }

  if(interaction.isModalSubmit()) {
    if (interaction.customId === 'kayitform') {
      
         const kayitisims = interaction.fields.getTextInputValue("kayitisim")
         const kayityass = interaction.fields.getTextInputValue('kayityas')
         interaction.member.setNickname(`${kayitisims} | ${kayityass}`)
         interaction.update({content: `${interaction.user} Adlı kullanıcı başarılı bir şekilde kayıt oldu!`, embeds: [], components: []})
         const kayitsistemi = db.fetch(`kayıtsistemi_${interaction.guild.id}`)
    
         const kayıtlı = await interaction.guild.roles.cache.find( ch => ch.id === kayitsistemi.kayıtlırol );
         const kayıtsız = await interaction.guild.roles.cache.find(rl => rl.id === kayitsistemi.kayıtsızrol);

         interaction.guild.members.cache.get(interaction.member.id).roles.remove(kayıtsız.id)
         interaction.guild.members.cache.get(interaction.member.id).roles.add(kayıtlı.id)
		 db.set(`kayıtlıuye_${interaction.member.id}`, { isim: kayitisims, yas: kayityass })
     }

     if (interaction.customId === 'form') {
              
      let onay = db.get(`onay_${interaction.guild.id}`)
      let logg = db.get(`log_${interaction.guild.id}`)
      let botRol = db.get(`botRol_${interaction.guild.id}`)
      let devRol = db.get(`devRol_${interaction.guild.id}`)
      let botekle = db.get(`botekle_${interaction.guild.id}`)
      let ayrildiLog = db.get(`ayrildiLog_${interaction.guild.id}`)
      let adminRol = db.get(`adminRol_${interaction.guild.id}`)

      if (!onay) interaction.reply({ content: "<a:arp:1318968419940569159> | Botlist sistemi ayarlanmamış!", ephemeral: true })
      if (!logg) interaction.reply({ content: "<a:arp:1318968419940569159> | Botlist sistemi ayarlanmamış!", ephemeral: true })
      if (!botRol) interaction.reply({ content: "<a:arp:1318968419940569159> | Botlist sistemi ayarlanmamış!", ephemeral: true })
      if (!devRol) interaction.reply({ content: "<a:arp:1318968419940569159> | Botlist sistemi ayarlanmamış!", ephemeral: true })
      if (!adminRol) interaction.reply({ content: "<a:arp:1318968419940569159> | Botlist sistemi ayarlanmamış!", ephemeral: true })
      if (!botekle) interaction.reply({ content: "<a:arp:1318968419940569159> | Botlist sistemi ayarlanmamış!", ephemeral: true })
      if (!ayrildiLog) interaction.reply({ content: "<a:arp:1318968419940569159> | Botlist sistemi ayarlanmamış!", ephemeral: true })

      const Discord = require("discord.js")
      const id = interaction.fields.getTextInputValue("id")
      const prefix = interaction.fields.getTextInputValue('prefix')
      const sahip = (`<@${interaction.user.id}>`)
	  const sunucuid = interaction.guild.id
	  const botSira = db.fetch(`botSira_${interaction.guild.id}`)

      const row = new Discord.ActionRowBuilder()
          .addComponents(
              new Discord.ButtonBuilder()
                  .setLabel("Botu Ekle")
                  .setStyle(Discord.ButtonStyle.Link)
                  .setURL("https://discord.com/oauth2/authorize?client_id=" + id + "&scope=bot&permissions=0&guild_id=" + sunucuid + ""), 
              new Discord.ButtonBuilder()
                  .setLabel("Reddet")
                  .setStyle(Discord.ButtonStyle.Danger)
                  .setEmoji('1040649840394260510')
                  .setCustomId("reddet_everyone")
          )

      adminRol = db.get(`adminRol_${interaction.guild.id}`)
      let a = await client.users.fetch(id);
      let avatar = a.avatar
      let link = "https://cdn.discordapp.com/avatars/" + id + "/" + avatar + ".png?size=1024"

      const gonderildi = new EmbedBuilder()
          .setTitle("<a:tik:1318968486671945840> | Başarılı!")
          .setDescription("Bot başvurun başarıyla yetkililere gönderildi!")
          .setColor("Green")
      
            const fetch = (await import ('node-fetch')).default
      let response = await fetch("https://discord.com/api/v10/oauth2/authorize?client_id=" + id + "&scope=bot", { 
        method: 'GET',  
        headers: { 
            'Authorization': "OTMyMjgzMzQxMzkzMjMxODgy.YfrPwg.COh2rR-zXju_fCN0VbMFqJqnSfg"
        }
      })
      let body = await response.json();

      const logembed = new EmbedBuilder()
      .setTitle("Sisteme yeni bir bot başvuruldu!")
      .setDescription("<@" + id + "> adlı bot sıraya eklendi!")
      .addFields(
        { name: "**> Ekleyen Hakkında**", value: `${interaction.user}`, inline: true },
        { name: "**> Bot Hakkında**", value: `\`${body.bot.approximate_guild_count}\` Sunucu`, inline: true },
		{ name: "**> Bot Sırası**", value: `**${botSira}** adet bot bekliyor!`}
      )
      .setColor('DarkGrey')
      .setThumbnail(link)
      client.channels.cache.get(logg).send({ embeds: [logembed] })

      const embed = new EmbedBuilder()
          .setTitle("Sıraya Yeni Bot Eklendi!")
          .setDescription("Bot Sahibi: " + sahip + "\n\n**İD:** ```" + id + "``` **Prefix:** ```" + prefix + "```")
          .setColor("Yellow")
          .setThumbnail(link)
      let log = db.get(`onay_${interaction.guild.id}`)

        db.set(`ekleniyor_${id}${interaction.guild.id}`, { bot: id, user: interaction.user.id })

         client.channels.cache.get(log).send({ content: `<@&${adminRol}>`, embeds: [embed], components: [row] }).then((mesaj) => {
         db.set(`bot_${mesaj.id}`, { user: interaction.user.id, bot: id })
          db.set(`ekledi_${interaction.user.id}`, id)
		  db.add(`botSira_${interaction.guild.id}`, 1)
         
         return interaction.reply({ embeds: [gonderildi], ephemeral: true })
          
      })
    }

      if (interaction.customId === 'eklemenu2') {
        const id = interaction.fields.getTextInputValue('cikarid')
      let oda = interaction.member.voice.channel
      oda.permissionOverwrites.create(
        id, {ViewChannel: false}      
        )
        interaction.reply("<a:tik:1318968486671945840> | <@"+id+"> Adlı Kullanıcı Odadan Başarıyla Atıldı")
      } else {
    }

    if (interaction.customId === 'eklemenu') {
      const id = interaction.fields.getTextInputValue('uyeid')
    let oda = interaction.member.voice.channel
    oda.permissionOverwrites.create(
      id, {ViewChannel: true}      
      )
      interaction.reply("<a:tik:1318968486671945840> | <@"+id+"> Adlı Kullanıcı Odaya Eklendi")
    } else {
  }
    
  if (interaction.customId === 'rcaptcha') {
	      
    const code = interaction.fields.getTextInputValue('rcaptchaInput');
    
    if(code === db.fetch(`beklenıyor_${interaction.guild.id}${interaction.user.id}`))
      {
        if(!db.fetch(`rcaptchaOnaylılar_${interaction.guild.id}`))
          {
            db.set(`rcaptchaOnaylılar_${interaction.guild.id}`, [])
          }
        
        interaction.member.roles.add(db.fetch(`rcaptcha_${interaction.guild.id}`).rol)
        db.delete(`beklenıyor_${interaction.guild.id}${interaction.user.id}`)
        db.push(`rcaptchaOnaylılar_${interaction.guild.id}`, interaction.user.id)
        
        return interaction.update({ embeds: [
          new Discord.EmbedBuilder()
          .setColor("#36393F")
          .setDescription('✅ **|** Tebrikler, doğrulama sistemini başarıyla geçtiniz.')
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        ], files: [], components: [] })
      }
      else
        {
          return interaction.reply({ embeds: [
          new Discord.EmbedBuilder()
          .setColor("#36393F")
          .setDescription(':x: **|** Yanlış kod, tekrar deneyiniz.')
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        ], ephemeral: true })
        }
  }
  
   if(interaction.customId === 'ticketforms'){
  const ticketSystem = db.fetch(`ticketSystem_${interaction.guild.id}`)


  const lvl = db.fetch(`ticketLvl_${interaction.guild.id}`) || 0;

  db.add(`ticketLvl_${interaction.guild.id}`, 1)


  const ticketYetkili = await interaction.guild.roles.cache.find( ch => ch.id === ticketSystem.yetkili );

  const ticketCategory = db.fetch(`ticketCategory_${interaction.guild.id}`);

  const ticketsebep = interaction.fields.getTextInputValue('ticketInput');
 const channel = await interaction.guild.channels.create({
   name: `talep-${interaction.user.username}-`+lvl,
   type: Discord.ChannelType.GuildText,
   parent: ticketCategory.category,
   permissionOverwrites: [
     {
       id: interaction.guild.id,
       deny: [Discord.PermissionsBitField.Flags.ViewChannel],
     },
      {
       id: interaction.user.id,
       allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
     },
     {
      id: ticketYetkili.id,
      allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
     },
   ],
 });
 const sebepTicket = new Discord.EmbedBuilder()
 .setDescription(`Neden talep açtığını öğrenebilir miyiz?\n> \`${ticketsebep}\``)
 const ticketUserEmbed = new Discord.EmbedBuilder()
 .setAuthor({ name: `${interaction.user.username} | Destek açıldı`, iconURL: `${interaction.user.displayAvatarURL({ dynmaic: true })} ` })
 .setThumbnail(interaction.guild.iconURL({ dynmaic: true }))
 .addFields([ 
  { name: "Destek açan:", value: `${interaction.user}`, inline: true },
  { name: "Açılış zamanı:", value: `<t:${parseInt(channel.createdTimestamp / 1000)}:R>`, inline: true }
 ])
 .setColor('Green')
 .setFooter({ text: `Oluşturan: ${client.user.tag}`, iconURL: `${client.user.displayAvatarURL({ dynmaic: true })}` })
 .setTimestamp()
 
 const row = new Discord.ActionRowBuilder()
 .addComponents(
   new Discord.ButtonBuilder()
     .setCustomId(`ticketClose_everyone`)
     .setLabel('Destek kapatılsın.')
     .setEmoji("🔒")
     .setStyle(Discord.ButtonStyle.Secondary),
 );
 
  interaction.reply({ content: `<a:tik:1318968486671945840> **|** Senin için bir tane destek kanalı ${channel} oluşturldu.`, ephemeral: true })

  db.set(`ticketChannelUser_${interaction.guild.id}${channel.id}`, { user: interaction.user.id })
  db.set(`ticketUser_${interaction.user.id}${interaction.guild.id}`, { whOpen: interaction.user.id, date: Date.now() })

  channel.send({ content: `<@${interaction.user.id}> | ${ticketYetkili}`, embeds: [ticketUserEmbed] })
  return channel.send({ embeds: [sebepTicket], components: [row]  })

}

if(interaction.customId === 'giriscikis'){
  const joinMsg = interaction.fields.getTextInputValue('girismesaj')
  .replaceAll("{guild.memberCount}", `${interaction.guild.memberCount}`)
  .replaceAll("{guild.name}", `${interaction.guild.name}`)
  .replaceAll("{owner.name}", `<@${interaction.guild.ownerId}>`)
  .replaceAll("{member}", `<@${client.user.id}>`)
  const leaveMsg = interaction.fields.getTextInputValue('cikismesaj')
  .replaceAll("{guild.memberCount}", `${interaction.guild.memberCount}`)
  .replaceAll("{guild.name}", `${interaction.guild.name}`)
  .replaceAll("{owner.name}", `<@${interaction.guild.ownerId}>`)
  .replaceAll("{member}", `<@${client.user.id}>`)

  const reLeaveMsg = interaction.fields.getTextInputValue('cikismesaj')
  const reJoinMsg = interaction.fields.getTextInputValue('girismesaj')

  const sayacmessage = db.fetch(`sayacmessage_${interaction.guild.id}`)
  const sayacmessageDate = db.fetch(`sayacmessageDate_${interaction.guild.id}`)
  
  if (sayacmessage && sayacmessageDate) {
      const date = new EmbedBuilder()
      .setDescription(`<a:arp:1318968419940569159> | Bu sistem <t:${parseInt(sayacmessageDate.date / 1000)}:R> önce açılmış!`)
  
  return interaction.reply({ embeds: [date], ephemeral: true })
  }

  const row1 = new Discord.ActionRowBuilder()

  .addComponents(
      new Discord.ButtonBuilder()
          .setLabel("Giriş Çıkış Mesajını Ayarla!")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setCustomId("giriscikismesaj_"+interaction.user.id)
          .setDisabled(true)
  )

  .addComponents(
      new Discord.ButtonBuilder()
          .setLabel("Giriş Çıkış Mesajını Sıfırla!")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setCustomId("giriscikismesajsifirla_"+interaction.user.id)
  )
  const embed = new EmbedBuilder()
  .setColor(0x2F3136)
  .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()} ` })
  .setDescription("<a:tik:1318968486671945840> **|** Giriş çıkış mesajı aktif edildi!")
  .addFields([
    {
      name: "Karşılama mesajı:",
      value: "`"+joinMsg+"`",
      inline: false
    },
    {
      name: "Ayrılış mesajı:",
      value: "`"+leaveMsg+"`",
      inline: false
    },
  ]);
  db.set(`sayacmessageDate_${interaction.guild.id}`, { date: Date.now() })
  db.set(`sayacmessage_${interaction.guild.id}`, { joinMsg: reJoinMsg,  leaveMsg: reLeaveMsg })

  return interaction.update({ embeds: [embed], components: [row1] })


  }
	
  }

    const butonrol = db.fetch(`buton_rol${interaction.guild.id}`)
    if(butonrol)
    if (!interaction.isButton()) return;
    if(interaction.customId === "rol_everyone") {
        if(!interaction.member.roles.cache.has(butonrol)) { 
        interaction.member.roles.add(butonrol)
      interaction.reply({content: "<a:tik:1318968486671945840> | Rol Başarıyla Verildi!", ephemeral: true})
       } else {
         
        interaction.member.roles.remove(butonrol)
      interaction.reply({content: "<a:tik:1318968486671945840> | Rol Başarıyla Alındı!", ephemeral: true})
    }
      }

        if (!interaction.isButton()) return;
        if (interaction.customId === "moderasyon_"+interaction.user.id) {
          const kayıt = new Discord.ActionRowBuilder()
          .addComponents(
              new Discord.ButtonBuilder()
              .setStyle("Secondary")
              .setEmoji("1039607060775571476")
              .setLabel("Moderasyon")
              .setDisabled(true)
              .setCustomId("moderasyon_"+interaction.user.id),
              new Discord.ButtonBuilder()
        .setLabel("Kayıt")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1039607052340834354')
        .setCustomId("kayıt_"+interaction.user.id),
        
            new Discord.ButtonBuilder()
            .setLabel("Kullanıcı")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji('1039607059357913098')
            .setCustomId("kullanıcı_"+interaction.user.id),
            new Discord.ButtonBuilder()
            .setLabel("Sistemler")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji('1039607040898781325')
            .setCustomId("sistemler_"+interaction.user.id))
            const row2 = new Discord.ActionRowBuilder()
      .addComponents(
            new Discord.ButtonBuilder()
            .setLabel("Koruma")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji("1044325545925672976")
            .setCustomId("korumasystem_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Geri")
        .setEmoji('1041737369436557393')
        .setDisabled(true)
        .setCustomId("geri"),
        new Discord.ButtonBuilder()
        .setLabel("Ana Sayfa")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1044325564636471397')
        .setCustomId("anasayfa_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("İleri")
        .setEmoji('1041737371131056218')
        .setCustomId("ileri_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setEmoji("1039607063443161158")
        .setLabel(" ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId(".clearMessageButton_"+interaction.user.id)
      )
          const embed = new EmbedBuilder()
          .setTitle("> <:mod:1039607060775571476> | ATOMLAND - Moderasyon Menüsü!")
          .addFields(
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </ban-list:1039964202003079243>**", value: `> <:sparklescyan:1285169162985148493> **Banlı kullanıcıları gösterir!**`, inline: true },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </ban:1039964202003079244>**", value: `> <:sparklescyan:1285169162985148493> **Bir üyeyi yasaklarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </emojiler:1039964202003079250>**", value: `> <:sparklescyan:1285169162985148493> **Emojileri gösterir!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </forceban:1039964202045030420>**", value: `> <:sparklescyan:1285169162985148493> **ID ile kullanıcı banlarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </giriş-çıkış:1039964202045030424> | </giriş-çıkış-kapat:1039964202045030423>**", value: `> <:sparklescyan:1285169162985148493> **Giriş çıkış kanalını ayarlarsın!**`, inline: true  },
		{ name: "**> <a:UtilityDeveloper:1284009078829355050> </giriş-çıkış-mesaj:1067118408816132207>**", value: `> <:sparklescyan:1285169162985148493> **Giriş çıkış mesajını ayarlarsınız!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </kanal-açıklama:1039964202045030426>**", value: `> <:sparklescyan:1285169162985148493> **Kanal açıklamasını değiştirirsin!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </kick:1039964202095349880>**", value: `> <:sparklescyan:1285169162985148493> **Bir üyeyi atarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </küfür-engel:1039964202095349883>**", value: `> <:sparklescyan:1285169162985148493> **Küfür engel sistemini açıp kapatırsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </oto-rol:1039964202095349887> | </oto-rol-kapat:1039964202095349886>**", value: `> <:sparklescyan:1285169162985148493> **OtoRol'ü ayarlarsın!!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </oto-tag:1039964202095349889> | </oto-tag-kapat:1039964202095349888>**", value: `> <:sparklescyan:1285169162985148493> **OtoTag'ı ayarlarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </oylama:1039964202149879908>**", value: `> <:sparklescyan:1285169162985148493> **Oylama başlatırsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </reklam-engel:1039964202149879911>**", value: `> <:sparklescyan:1285169162985148493> **Reklam engellemeyi açarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </rol-al:1039964202149879912>**", value: `> <:sparklescyan:1285169162985148493> **Rol alırsın!**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </timeout-sistemi:1048961342540877907>**", value: `> <:sparklescyan:1285169162985148493> **Timeout sistemini ayarlarsın!**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </timeout-sistemi-sıfırla:1048961342540877906>**", value: `> <:sparklescyan:1285169162985148493> **Timeout sistemini sıfırlarsın!**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </timeout:1048961342540877908>**", value: `> <:sparklescyan:1285169162985148493> **Belirlenen kullanıcıya timeout atar.**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </untimeout:1048961342540877909>**", value: `> <:sparklescyan:1285169162985148493> **Belirlenen kullanıcının timeoutunu kaldırır.**`, inline: true  },
                  )
          .setColor("Random")
            interaction.update({embeds: [embed], components: [kayıt, row2]})
        }
      
        if (!interaction.isButton()) return;
        if (interaction.customId == "ileri_"+interaction.user.id) {
          const kayıt23 = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji("1039607060775571476")
            .setLabel("Moderasyon")
            .setDisabled(true)
            .setCustomId("moderasyon_"+interaction.user.id),
            new Discord.ButtonBuilder()
      .setLabel("Kayıt")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607052340834354')
      .setCustomId("kayıt_"+interaction.user.id),
          new Discord.ButtonBuilder()
          .setLabel("Kullanıcı")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setEmoji('1039607059357913098')
          .setCustomId("kullanıcı_"+interaction.user.id),
          new Discord.ButtonBuilder()
          .setLabel("Sistemler")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setEmoji('1039607040898781325')
          .setCustomId("sistemler_"+interaction.user.id))
      const row2 = new Discord.ActionRowBuilder()
      .addComponents(
            new Discord.ButtonBuilder()
            .setLabel("Koruma")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji("1044325545925672976")
            .setCustomId("korumasystem_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Geri")
        .setEmoji('1041737369436557393')
        .setCustomId("geri_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setLabel("Ana Sayfa")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1044325564636471397')
        .setCustomId("anasayfa_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("İleri")
        .setEmoji('1041737371131056218')
        .setDisabled(true)
        .setCustomId("ileri"),
        new Discord.ButtonBuilder()
        .setEmoji("1039607063443161158")
        .setLabel(" ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId(".clearMessageButton_"+interaction.user.id)
      )
      const embed = new Discord.EmbedBuilder()
      .setTitle("> <:mod:1039607060775571476> | ATOMLAND - Moderasyon 2 Menüsü!")
      .addFields(
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </rol-oluştur:1039964202149879913>**", value: `> <:sparklescyan:1285169162985148493> **Rol oluşturursun!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </rol-ver:1039964202149879914>**", value: `> <:sparklescyan:1285169162985148493> **Rol verirsin!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </sa-as:1039964202149879915>**", value: `> <:sparklescyan:1285169162985148493> **Selam sistemini ayarlarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </sil:1039964202149879917>**", value: `> <:sparklescyan:1285169162985148493> **Mesaj silersin!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </unban:1039964202359603301>**", value: `> <:sparklescyan:1285169162985148493> **Bir üyenin yasağını kaldırırsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </buton-rol:1039964202003079246>**", value: `> <:sparklescyan:1285169162985148493> **Buton rol sistemini ayarlarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </capslock-koruma:1039964202003079247>**", value: `> <:sparklescyan:1285169162985148493> **CapsLock koruma sistemini ayarlarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </görsel-engel:1039964202045030422> | </görsel-engel-kapat:1039964202045030421>**", value: `> <:sparklescyan:1285169162985148493> **Görsel engelleme sistemini ayarlarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </yavaş-mod:1039964202359603303>**", value: `> <:sparklescyan:1285169162985148493> **Yavaş modu ayarlarsın!**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </sunucu-kur:1042791957463846972>**", value: `> <:sparklescyan:1285169162985148493> **Otomatik sunucu kurar!**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </mod-log ayarla:1043079840695324722>**", value: `> <:sparklescyan:1285169162985148493> **Moderasyon Logunu ayarlarsın!**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </yasaklı-kelime:1046365423945400420> | </yasaklı-kelime-kapat:1046366035315531796>**", value: `> <:sparklescyan:1285169162985148493> **Yasaklı Kelimeyi ayarlarsın!**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </kanal-aç:1046452705482248272>**", value: `> <:sparklescyan:1285169162985148493> **Kanalı mesaj gönderimine açarsın!**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </kanal-kilitle:1046452705482248273>**", value: `> <:sparklescyan:1285169162985148493> **Kanalı mesaj gönderimine kapatırsın!**`, inline: true  },
	  { name: "**> <a:UtilityDeveloper:1284009078829355050> </resimli-giriş-çıkış:1068595212705878137>**", value: `> <:sparklescyan:1285169162985148493> **Resimli giriş çıkış'ı ayarlarsın!**`, inline: true  }
      )
      .setColor("Random")
            interaction.update({embeds: [embed], components: [kayıt23, row2]})
        }
      
        if (!interaction.isButton()) return;
        if (interaction.customId == "geri_"+interaction.user.id) {
          const kayıt23 = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji("1039607060775571476")
            .setLabel("Moderasyon")
            .setDisabled(true)
            .setCustomId("moderasyon_"+interaction.user.id),
            new Discord.ButtonBuilder()
      .setLabel("Kayıt")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607052340834354')
      .setCustomId("kayıt_"+interaction.user.id),
          new Discord.ButtonBuilder()
          .setLabel("Kullanıcı")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setEmoji('1039607059357913098')
          .setCustomId("kullanıcı_"+interaction.user.id),
          new Discord.ButtonBuilder()
          .setLabel("Sistemler")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setEmoji('1039607040898781325')
          .setCustomId("sistemler_"+interaction.user.id))
      const row2 = new Discord.ActionRowBuilder()
      .addComponents(
            new Discord.ButtonBuilder()
            .setLabel("Koruma")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji("1044325545925672976")
            .setCustomId("korumasystem_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Geri")
        .setEmoji('1041737369436557393')
        .setDisabled(true)
        .setCustomId("geri"),
        new Discord.ButtonBuilder()
        .setLabel("Ana Sayfa")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1044325564636471397')
        .setCustomId("anasayfa_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("İleri")
        .setEmoji('1041737371131056218')
        .setCustomId("ileri_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setEmoji("1039607063443161158")
        .setLabel(" ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId(".clearMessageButton_"+interaction.user.id)
      )
      const embed = new Discord.EmbedBuilder()
      .setTitle("> <:mod:1039607060775571476> | ATOMLAND - Moderasyon Menüsü!")
      .addFields(
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </ban-list:1039964202003079243>**", value: `> <:sparklescyan:1285169162985148493> **Banlı kullanıcıları gösterir!**`, inline: true },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </ban:1039964202003079244>**", value: `> <:sparklescyan:1285169162985148493> **Bir üyeyi yasaklarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </emojiler:1039964202003079250>**", value: `> <:sparklescyan:1285169162985148493> **Emojileri gösterir!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </forceban:1039964202045030420>**", value: `> <:sparklescyan:1285169162985148493> **ID ile kullanıcı banlarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </giriş-çıkış:1039964202045030424> | </giriş-çıkış-kapat:1039964202045030423>**", value: `> <:sparklescyan:1285169162985148493> **Giriş çıkış kanalını ayarlarsın!**`, inline: true  },
		{ name: "**> <a:UtilityDeveloper:1284009078829355050> </giriş-çıkış-mesaj:1067118408816132207>**", value: `> <:sparklescyan:1285169162985148493> **Giriş çıkış mesajını ayarlarsınız!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </kanal-açıklama:1039964202045030426>**", value: `> <:sparklescyan:1285169162985148493> **Kanal açıklamasını değiştirirsin!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </kick:1039964202095349880>**", value: `> <:sparklescyan:1285169162985148493> **Bir üyeyi atarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </küfür-engel:1039964202095349883>**", value: `> <:sparklescyan:1285169162985148493> **Küfür engel sistemini açıp kapatırsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </oto-rol:1039964202095349887> | </oto-rol-kapat:1039964202095349886>**", value: `> <:sparklescyan:1285169162985148493> **OtoRol'ü ayarlarsın!!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </oto-tag:1039964202095349889> | </oto-tag-kapat:1039964202095349888>**", value: `> <:sparklescyan:1285169162985148493> **OtoTag'ı ayarlarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </oylama:1039964202149879908>**", value: `> <:sparklescyan:1285169162985148493> **Oylama başlatırsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </reklam-engel:1039964202149879911>**", value: `> <:sparklescyan:1285169162985148493> **Reklam engellemeyi açarsın!**`, inline: true  },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </rol-al:1039964202149879912>**", value: `> <:sparklescyan:1285169162985148493> **Rol alırsın!**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </timeout-sistemi:1048961342540877907>**", value: `> <:sparklescyan:1285169162985148493> **Timeout sistemini ayarlarsın!**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </timeout-sistemi-sıfırla:1048961342540877906>**", value: `> <:sparklescyan:1285169162985148493> **Timeout sistemini sıfırlarsın!**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </timeout:1048961342540877908>**", value: `> <:sparklescyan:1285169162985148493> **Belirlenen kullanıcıya timeout atar.**`, inline: true  },
      { name: "**> <a:UtilityDeveloper:1284009078829355050> </untimeout:1048961342540877909>**", value: `> <:sparklescyan:1285169162985148493> **Belirlenen kullanıcının timeoutunu kaldırır.**`, inline: true  },
              )
      .setColor("Random")
            interaction.update({embeds: [embed], components: [kayıt23, row2]})
        }
      
        if (!interaction.isButton()) return;
        if (interaction.customId == "kayıt_"+interaction.user.id) {
          const kayıt23 = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji("1039607060775571476")
            .setLabel("Moderasyon")
            .setCustomId("moderasyon_"+interaction.user.id),
            new Discord.ButtonBuilder()
      .setLabel("Kayıt")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607052340834354')
      .setDisabled(true)
      .setCustomId("kayıt_"+interaction.user.id),
      
          new Discord.ButtonBuilder()
          .setLabel("Kullanıcı")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setEmoji('1039607059357913098')
          .setCustomId("kullanıcı_"+interaction.user.id),
          new Discord.ButtonBuilder()
          .setLabel("Sistemler")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setEmoji('1039607040898781325')
          .setCustomId("sistemler_"+interaction.user.id))
          const row2 = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setLabel("Koruma")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji("1044325545925672976")
            .setCustomId("korumasystem_"+interaction.user.id),
            new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Secondary)
            .setLabel("ㅤㅤㅤ")
            .setDisabled(true)
            .setCustomId("süsbutton2"),
            new Discord.ButtonBuilder()
            .setLabel("Ana Sayfa")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji('1044325564636471397')
            .setCustomId("anasayfa_"+interaction.user.id),
            new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Secondary)
            .setLabel("ㅤㅤㅤ")
            .setDisabled(true)
            .setCustomId("süsbutton3"),
            new Discord.ButtonBuilder()
            .setEmoji("1039607063443161158")
            .setLabel(" ")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setCustomId(".clearMessageButton_"+interaction.user.id)
          )
          const embed = new EmbedBuilder()
          .setTitle("> <:ek:1039607052340834354> | ATOMLAND - Kayıt Menüsü!")
          .addFields(
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </kayıt-sistemi:1063887700786159709>**", value: `> <:sparklescyan:1285169162985148493> **Kayıt sistemini ayarlarsın!**`, inline: true },
          { name: "**> <a:UtilityDeveloper:1284009078829355050> </kayıt-sistemi-kapat:1063887700786159708>**", value: `> <:sparklescyan:1285169162985148493> **Kayıt sistemini kapatırsın**`, inline: true },
			  { name: "**> <a:UtilityDeveloper:1284009078829355050> </kayıt-isim-sıfırla:1063887700786159708>**", value: `> <:sparklescyan:1285169162985148493> **Kayıt sistemindeki ismini sıfırlarsın!**`, inline: true }
                  )
          .setColor("Random")
            interaction.update({embeds: [embed], components: [kayıt23, row2]})
        }
        if (!interaction.isButton()) return;
        if (interaction.customId == "kullanıcı_"+interaction.user.id) {
          const kayıt23 = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setStyle("Secondary")
            .setEmoji("1039607060775571476")
            .setLabel("Moderasyon")
            .setCustomId("moderasyon_"+interaction.user.id),
            new Discord.ButtonBuilder()
      .setLabel("Kayıt")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607052340834354')
      .setCustomId("kayıt_"+interaction.user.id),
          new Discord.ButtonBuilder()
          .setLabel("Kullanıcı")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setEmoji('1039607059357913098')
          .setDisabled(true)
          .setCustomId("kullanıcı"),
          new Discord.ButtonBuilder()
          .setLabel("Sistemler")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setEmoji('1039607040898781325')
          .setCustomId("sistemler_"+interaction.user.id))
          const row2 = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setLabel("Koruma")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji("1044325545925672976")
            .setCustomId("korumasystem_"+interaction.user.id),
            new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Secondary)
            .setLabel("ㅤㅤㅤ")
            .setDisabled(true)
            .setCustomId("süsbutton2"),
            new Discord.ButtonBuilder()
            .setLabel("Ana Sayfa")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji('1044325564636471397')
            .setCustomId("anasayfa_"+interaction.user.id),
            new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Secondary)
            .setLabel("ㅤㅤㅤ")
            .setDisabled(true)
            .setCustomId("süsbutton3"),
            new Discord.ButtonBuilder()
            .setEmoji("1039607063443161158")
            .setLabel(" ")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setCustomId(".clearMessageButton_"+interaction.user.id)
          )
          const embed = new EmbedBuilder()
          .setTitle("> <:member:1039607059357913098> | ATOMLAND - Kullanıcı Menüsü!")
          .addFields(
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </avatar:1039964202003079242>**", value: `> <:sparklescyan:1285169162985148493> **Avatarına bakarsın!**`, inline: true },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </afk:1039964202003079241>**", value: `> <:sparklescyan:1285169162985148493> **Afk olursun!**`, inline: true  },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </emoji-yazı:1039964202003079249>**", value: `> <:sparklescyan:1285169162985148493> **Bota emoji ile yazı!**`, inline: true  },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </istatistik:1039964202045030425>**", value: `> <:sparklescyan:1285169162985148493> **Bot istatistikleri!**`, inline: true  },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </kurucu-kim:1039964202095349882>**", value: `> <:sparklescyan:1285169162985148493> **Sunucunun kurucusunu gösterir!**`, inline: true  },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </ping:1039964202149879909>**", value: `> <:sparklescyan:1285169162985148493> **Botun pingini gösterir!**`, inline: true  },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </yardım:1039964202359603302>**", value: `> <:sparklescyan:1285169162985148493> **Yardım menüsü!**`, inline: true  },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </davet:1039964202003079248>**", value: `> <:sparklescyan:1285169162985148493> **Botun davet linki!**`, inline: true  },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </kullanıcı-bilgi:1039964202095349881>**", value: `> <:sparklescyan:1285169162985148493> **Kullanıcı bilgisi!**`, inline: true  },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </random-anime:1039964202149879910>**", value: `> <:sparklescyan:1285169162985148493> **Random Anime atar.**`, inline: true  },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </say:1039964202149879916>**", value: `> <:sparklescyan:1285169162985148493> **Sunucuda kaç üye olduğunu gösterir.**`, inline: true  },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </sunucupp:1069330554278912091>**", value: `> <:sparklescyan:1285169162985148493> **Sunucunun avatarına bakarsın!**`, inline: true  },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </sunucu-bilgi:1051458065578348546>**", value: `> <:sparklescyan:1285169162985148493> **Sunucu bilgilerini gösterir.**`, inline: true  },
          { name: "**> <a:UtilityDeveloper:1284009078829355050> </ayarlar:1053000987285127249>**", value: `> <:sparklescyan:1285169162985148493> **Sunucu ayarlarını gösterir.**`, inline: true  }
                  )
          .setColor("Random")
            interaction.update({embeds: [embed], components: [kayıt23, row2]})
        }
      
        if (!interaction.isButton()) return;
        if (interaction.customId == "sistemler_"+interaction.user.id) {
          const row = new Discord.ActionRowBuilder()
          .addComponents(
      new Discord.ButtonBuilder()
      .setLabel("Botlist")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607042291269703')
      .setCustomId("botlist_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Özel Oda")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1041739960493019197')
      .setCustomId("ozeloda_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1044325577064190033')
      .setLabel("Ticket")
      .setCustomId("yardimticket_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Level Sistemi")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1044325558563123312')
      .setCustomId("levelsistemi_"+interaction.user.id))
      const row2 = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Captcha")
        .setEmoji('1044325535800635422')
        .setCustomId("captchasistemi_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Sistemler")
        .setEmoji('1039607040898781325')
		.setDisabled(true)
        .setCustomId("sistemler_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setLabel("Ana Sayfa")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1044325564636471397')
        .setCustomId("anasayfa_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("ㅤ")
        .setDisabled(true)
        .setCustomId("süsbutton3"),
        new Discord.ButtonBuilder()
        .setEmoji("1039607063443161158")
        .setLabel(" ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId(".clearMessageButton_"+interaction.user.id)
      )
          const embed = new EmbedBuilder()
          .setAuthor({ name: "ATOMLAND Sistemler Menüsü", iconURL: client.user.displayAvatarURL({ dynamic: true })})
          .setTitle("・Hangi komutlarım hakkında bilgi almak istiyorsan o butona bas!")
          .setDescription("\n\n**🔗 Linkler**\n> <:Bot:1319328570845429861>・**Botun davet linki: [Tıkla](https://discord.com/channels/1281672893696311387/1281676496959701135/1319329207310090353)**\n> <a:redutility4:1284009023515136002>・**Botun destek sunucusu: [Tıkla](https://dc.atomland.xyz)**\n> <:new_member:1319328788202520608>・**Botun gizlilik politikası: [Tıkla](https://github.com/ATOMGAMERAGA/atomland-privacy-policy/)**")
          .setColor('Blue')
          interaction.update({embeds: [embed], components: [row, row2]})
      
        }
      
              if (!interaction.isButton()) return;
        if (interaction.customId == "korumasystem_"+interaction.user.id) {
          const embed = new Discord.EmbedBuilder()
          .setTitle("> <:koruma:1044325545925672976> | ATOMLAND - Koruma Menüsü!")
          .addFields(
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </hesap-koruma:1069205098888171560>**", value: `> <:sparklescyan:1285169162985148493> **Hesap koruma sistemini açarsın!**`, inline: true },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </koruma-log:1069205098888171561>**", value: `> <:sparklescyan:1285169162985148493> **Koruma logunu ayarlarsın!**`, inline: true }
          )
          .setColor("Random")
                
          const row = new Discord.ActionRowBuilder()
          .addComponents(
      new Discord.ButtonBuilder()
      .setLabel("Moderasyon")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607060775571476')
      .setCustomId("moderasyon_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Kayıt")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607052340834354')
      .setCustomId("kayıt_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Kullanıcı")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607059357913098')
      .setCustomId("kullanıcı_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Sistemler")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607040898781325')
      .setCustomId("sistemler_"+interaction.user.id))
      const row2 = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setLabel("Koruma")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji("1044325545925672976")
        .setCustomId("korumasystem_"+interaction.user.id)
        .setDisabled(true),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("ㅤㅤㅤ")
        .setDisabled(true)
        .setCustomId("süsbutton2"),
        new Discord.ButtonBuilder()
        .setLabel("Ana Sayfa")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1044325564636471397')
        .setCustomId("anasayfa_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("ㅤㅤㅤ")
        .setDisabled(true)
        .setCustomId("süsbutton3"),
        new Discord.ButtonBuilder()
        .setEmoji("1039607063443161158")
        .setLabel(" ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId(".clearMessageButton_"+interaction.user.id)
      )
      interaction.update({embeds: [embed], components: [row, row2]})
        }
      
        if (!interaction.isButton()) return;
        if (interaction.customId == "botlist_"+interaction.user.id) {
          const row = new Discord.ActionRowBuilder()
          .addComponents(
      new Discord.ButtonBuilder()
      .setLabel("Botlist")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607042291269703')
      .setDisabled(true)
      .setCustomId("botlist"),
      new Discord.ButtonBuilder()
      .setLabel("Özel Oda")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1041739960493019197')
      .setCustomId("ozeloda_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1044325577064190033')
      .setLabel("Ticket")
      .setCustomId("yardimticket_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Level Sistemi")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1044325558563123312')
      .setCustomId("levelsistemi_"+interaction.user.id))
      const row2 = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Captcha")
        .setEmoji('1044325535800635422')
        .setCustomId("captchasistemi_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Sistemler")
        .setEmoji('1039607040898781325')
        .setCustomId("sistemler_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setLabel("Ana Sayfa")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1044325564636471397')
        .setCustomId("anasayfa_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("ㅤ")
        .setDisabled(true)
        .setCustomId("süsbutton3"),
        new Discord.ButtonBuilder()
        .setEmoji("1039607063443161158")
        .setLabel(" ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId(".clearMessageButton_"+interaction.user.id)
      )
          const embed = new EmbedBuilder()
          .setTitle("> <:Bot:1319328570845429861> | ATOMLAND - Botlist Menüsü!")
          .addFields(
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </botlist-ayarla:1039964202003079245>**", value: `> <:sparklescyan:1285169162985148493> **Botlist sistemini ayarlarsın!**`, inline: true }
          )
          .setColor("Random")
            interaction.update({embeds: [embed], components: [row, row2]})
        }
        if (!interaction.isButton()) return;
        if (interaction.customId == "ozeloda_"+interaction.user.id) {
          const row = new Discord.ActionRowBuilder()
          .addComponents(
      new Discord.ButtonBuilder()
      .setLabel("Botlist")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607042291269703')
      .setCustomId("botlist_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Özel Oda")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1041739960493019197')
      .setDisabled(true)
      .setCustomId("ozeloda"),
      new Discord.ButtonBuilder()
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1044325577064190033')
      .setLabel("Ticket")
      .setCustomId("yardimticket_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Level Sistemi")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1044325558563123312')
      .setCustomId("levelsistemi_"+interaction.user.id))
      const row2 = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Captcha")
        .setEmoji('1044325535800635422')
        .setCustomId("captchasistemi_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Sistemler")
        .setEmoji('1039607040898781325')
        .setCustomId("sistemler_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setLabel("Ana Sayfa")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1044325564636471397')
        .setCustomId("anasayfa_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("ㅤ")
        .setDisabled(true)
        .setCustomId("süsbutton3"),
        new Discord.ButtonBuilder()
        .setEmoji("1039607063443161158")
        .setLabel(" ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId(".clearMessageButton_"+interaction.user.id)
      )
      const embed = new Discord.EmbedBuilder()
      .setTitle("> 🔊 | ATOMLAND - Özel Oda Menüsü!")
      .addFields(
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </özel-oda-sistemi:1041738859572105318>**", value: `> <:sparklescyan:1285169162985148493> **Özel Oda Sistemini ayarlarsın!**`, inline: true },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </özel-oda-sil:1041738859572105317>**", value: `> <:sparklescyan:1285169162985148493> **Özel Odanı silersin!**`, inline: true },
        { name: "**> <a:UtilityDeveloper:1284009078829355050> </özel-oda-kullanıcı-menü:1041738859572105316>**", value: `> <:sparklescyan:1285169162985148493> **Özel Odana kullanıcı eklersin!**`, inline: true }
      )
      .setColor("Random")
            interaction.update({embeds: [embed], components: [row, row2]})
        }
      
      
        if (!interaction.isButton()) return;
        if (interaction.customId == "anasayfa_"+interaction.user.id) {
          const embed = new EmbedBuilder()
          .setAuthor({ name: "ATOMLAND Yardım Menüsü", iconURL: client.user.displayAvatarURL({ dynamic: true })})
          .setTitle("・Hangi komutlarım hakkında bilgi almak istiyorsan o butona bas!")
          .setDescription("\n\n**🔗 Linkler**\n> <:Bot:1319328570845429861>・**Botun davet linki: [Tıkla](https://discord.com/channels/1281672893696311387/1281676496959701135/1319329207310090353)**\n> <a:redutility4:1284009023515136002>・**Botun destek sunucusu: [Tıkla](https://dc.atomland.xyz)**\n> <:new_member:1319328788202520608>・**Botun gizlilik politikası: [Tıkla](https://github.com/ATOMGAMERAGA/atomland-privacy-policy/)**")
          .setColor('Blue')
          const row = new Discord.ActionRowBuilder()
          .addComponents(
      new Discord.ButtonBuilder()
      .setLabel("Moderasyon")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607060775571476')
      .setCustomId("moderasyon_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Kayıt")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607052340834354')
      .setCustomId("kayıt_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Kullanıcı")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607059357913098')
      .setCustomId("kullanıcı_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Sistemler")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607040898781325')
      .setCustomId("sistemler_"+interaction.user.id))
      const row2 = new Discord.ActionRowBuilder()
      .addComponents(
            new Discord.ButtonBuilder()
            .setLabel("Koruma")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji("1044325545925672976")
            .setCustomId("korumasystem_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("ㅤㅤㅤ")
        .setDisabled(true)
        .setCustomId("süsbutton2"),
        new Discord.ButtonBuilder()
        .setLabel("Ana Sayfa")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1044325564636471397')
        .setDisabled(true)
        .setCustomId("anasayfa"),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("ㅤㅤ")
        .setDisabled(true)
        .setCustomId("süsbutton3"),
        new Discord.ButtonBuilder()
        .setEmoji("1039607063443161158")
        .setLabel(" ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId(".clearMessageButton_"+interaction.user.id)
      )
            interaction.update({embeds: [embed], components: [row, row2]})
        }
      
        if (!interaction.isButton()) return;
        if (interaction.customId == "yardimticket_"+interaction.user.id) {
          const row = new Discord.ActionRowBuilder()
          .addComponents(
      new Discord.ButtonBuilder()
      .setLabel("Botlist")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607042291269703')
      .setCustomId("botlist_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Özel Oda")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1041739960493019197')
      .setCustomId("ozeloda_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1044325577064190033')
      .setLabel("Ticket")
      .setDisabled(true)
      .setCustomId("yardimticket"),
      new Discord.ButtonBuilder()
      .setLabel("Level Sistemi")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1044325558563123312')
      .setCustomId("levelsistemi_"+interaction.user.id))
      const row2 = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Captcha")
        .setEmoji('1044325535800635422')
        .setCustomId("captchasistemi_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Sistemler")
        .setEmoji('1039607040898781325')
        .setCustomId("sistemler_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setLabel("Ana Sayfa")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1044325564636471397')
        .setCustomId("anasayfa_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("ㅤ")
        .setDisabled(true)
        .setCustomId("süsbutton3"),
        new Discord.ButtonBuilder()
        .setEmoji("1039607063443161158")
        .setLabel(" ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId(".clearMessageButton_"+interaction.user.id)
      )
          const embed = new EmbedBuilder()
          .setTitle("> <:yenilik:1044325577064190033> | ATOMLAND - Ticket Menüsü!")
          .addFields(
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </destek-sistemi:1065718561311567995>**", value: `> <:sparklescyan:1285169162985148493> **Destek sistemini ayarlarsın!**`, inline: true },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </destek-sistemi-sıfırla:1065718561311567994>**", value: `> <:sparklescyan:1285169162985148493> **Destek sistemini sıfırlarsın!.**`, inline: true  }
                  )
          .setColor("Random")
            interaction.update({embeds: [embed], components: [row, row2]})
        }
      
        if (!interaction.isButton()) return;
        if (interaction.customId == "levelsistemi_"+interaction.user.id) {
          const row = new Discord.ActionRowBuilder()
          .addComponents(
      new Discord.ButtonBuilder()
      .setLabel("Botlist")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607042291269703')
      .setCustomId("botlist_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Özel Oda")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1041739960493019197')
      .setCustomId("ozeloda_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1044325577064190033')
      .setLabel("Ticket")
      .setCustomId("yardimticket_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Level Sistemi")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1044325558563123312')
      .setDisabled(true)
      .setCustomId("levelsistemi"))
      const row2 = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Captcha")
        .setEmoji('1044325535800635422')
        .setCustomId("captchasistemi_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Sistemler")
        .setEmoji('1039607040898781325')
        .setCustomId("sistemler_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setLabel("Ana Sayfa")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1044325564636471397')
        .setCustomId("anasayfa_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("ㅤ")
        .setDisabled(true)
        .setCustomId("süsbutton3"),
        new Discord.ButtonBuilder()
        .setEmoji("1039607063443161158")
        .setLabel(" ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId(".clearMessageButton_"+interaction.user.id)
      )
          const embed = new EmbedBuilder()
          .setTitle("> <:NicePng_mariopixelpng_1691779:1284008084297224223> | ATOMLAND - Level Menüsü!")
          .addFields(
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </level-sistemi:1053000987285127254>**", value: `> <:sparklescyan:1285169162985148493> **Level sistemini açarsın!**`, inline: true },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </level-log ayarla:1053000987285127252>**", value: `> <:sparklescyan:1285169162985148493> **Level logu ayarlarsın!**`, inline: true },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </level:1053000987285127255>**", value: `> <:sparklescyan:1285169162985148493> **Levelini görüntülersin!**`, inline: true },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </level-ekle:1053000987285127251>**", value: `> <:sparklescyan:1285169162985148493> **Level eklersin!**`, inline: true },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </level-kaldır:1053000987285127253>**", value: `> <:sparklescyan:1285169162985148493> **Level kaldırırsın!**`, inline: true },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </level-arka-plan:1053750137077387334>**", value: `> <:sparklescyan:1285169162985148493> **Level arkaplanını ayarlarsın!**`, inline: true },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </level-sıralaması:1053000987285127250>**", value: `> <:sparklescyan:1285169162985148493> **Level sıralamasını görüntülersin!**`, inline: true }
          )
          .setColor("Random")
            interaction.update({embeds: [embed], components: [row, row2]})
        }
		
		if (!interaction.isButton()) return;
        if (interaction.customId == "captchasistemi_"+interaction.user.id) {
          const row = new Discord.ActionRowBuilder()
          .addComponents(
      new Discord.ButtonBuilder()
      .setLabel("Botlist")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1039607042291269703')
      .setCustomId("botlist_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Özel Oda")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1041739960493019197')
      .setCustomId("ozeloda_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1044325577064190033')
      .setLabel("Ticket")
      .setCustomId("yardimticket_"+interaction.user.id),
      new Discord.ButtonBuilder()
      .setLabel("Level Sistemi")
      .setStyle(Discord.ButtonStyle.Secondary)
      .setEmoji('1044325558563123312')
      .setCustomId("levelsistemi_"+interaction.user.id))
      const row2 = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Captcha")
        .setEmoji('1044325535800635422')
        .setDisabled(true)
        .setCustomId("captchasistemi_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("Sistemler")
        .setEmoji('1039607040898781325')
        .setCustomId("sistemler_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setLabel("Ana Sayfa")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji('1044325564636471397')
        .setCustomId("anasayfa_"+interaction.user.id),
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel("ㅤ")
        .setDisabled(true)
        .setCustomId("süsbutton3"),
        new Discord.ButtonBuilder()
        .setEmoji("1039607063443161158")
        .setLabel(" ")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId(".clearMessageButton_"+interaction.user.id)
      )
          const embed = new EmbedBuilder()
          .setTitle("> <:NicePng_mariopixelpng_1691779:1284008084297224223> | ATOMLAND - Captcha Menüsü!")
          .addFields(
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </captcha-sistemi:1064125585166708918>**", value: `> <:sparklescyan:1285169162985148493> **Captcha sistemini açarsın!**`, inline: true },
            { name: "**> <a:UtilityDeveloper:1284009078829355050> </captcha-görüntüle:1064125585166708917>**", value: `> <:sparklescyan:1285169162985148493> **Captcha istatistiklerini görüntülersin!**`, inline: true },
			{ name: "**> <a:UtilityDeveloper:1284009078829355050> </captcha-sistemi-sıfırla:1068963862600220732>**", value: `> <:sparklescyan:1285169162985148493> **Captcha sistemini sıfırlarsın!**`, inline: true }
          )
          .setColor("Random")
            interaction.update({embeds: [embed], components: [row, row2]})
        }


        if (!interaction.isButton()) return;
        
        let user = edb.get(`oylamaUSER_${interaction.message.id}_${interaction.user.id}`) 
        
        if(interaction.customId == "evetoylama_everyone") {
        if(!user) {
        edb.add(`oylamaEVET_${interaction.message.id}`, 1)
        
        let dataEvet = edb.get(`oylamaEVET_${interaction.message.id}`) || "0"
        let dataHayır = edb.get(`oylamaHAYIR_${interaction.message.id}`) || "0"
        
      
        const row = new Discord.ActionRowBuilder()
        .addComponents(
        new Discord.ButtonBuilder()
        .setStyle("Success")
        .setLabel(`(${dataEvet}) Evet`)
        .setEmoji("922176863911149660")
        .setCustomId("evetoylama_everyone"),
        new Discord.ButtonBuilder()
        .setStyle("Danger")
        .setLabel(`(${dataHayır}) Hayır`)
        .setEmoji("922176863881797693")
        .setCustomId("hayıroylama_everyone"))
        
        interaction.message.edit({ components: [row] })
        
        edb.set(`oylamaUSER_${interaction.message.id}_${interaction.user.id}`, interaction.user.id) 
        }
        
        interaction.deferUpdate();
        }
        
        if(interaction.customId == "hayıroylama_everyone") {
        if(!user) {
        edb.add(`oylamaHAYIR_${interaction.message.id}`, 1)
        
        let dataEvet = edb.get(`oylamaEVET_${interaction.message.id}`) || "0"
        let dataHayır = edb.get(`oylamaHAYIR_${interaction.message.id}`) || "0"
        
      
        const row = new Discord.ActionRowBuilder()
        .addComponents(
        new Discord.ButtonBuilder()
        .setStyle("Success")
        .setLabel(`(${dataEvet}) Evet`)
        .setEmoji("922176863911149660")
        .setCustomId("evetoylama_everyone"),
        new Discord.ButtonBuilder()
        .setStyle("Danger")
        .setLabel(`(${dataHayır}) Hayır`)
        .setEmoji("922176863881797693")
        .setCustomId("hayıroylama_everyone"))
      
        interaction.message.edit({ components: [row] })
        
        edb.set(`oylamaUSER_${interaction.message.id}_${interaction.user.id}`, interaction.user.id) 
        }
        
        interaction.deferUpdate();
        }

          const kullanıcı = db.fetch(`muteKullanici_${interaction.user.id}`)
          if (!interaction.isButton()) return;
          if (interaction.customId === "muteonay_"+interaction.user.id) {
        
            const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('muteonay_'+interaction.user.id)
                    .setLabel('Onayla')
                    .setDisabled(true)
                    .setEmoji("1039607067729727519")
                    .setStyle('Success'),
                new Discord.ButtonBuilder()
                    .setCustomId('mutered_'+interaction.user.id)
                    .setLabel('İptal')
                    .setDisabled(true)
                    .setEmoji("1040649840394260510")
                    .setStyle('Danger'),
        
            );
            const dmb = deleteMessageButton(interaction, {
              label: "Mesajı sil.",
              style: Discord.ButtonStyle.Secondary,
              emoji: "<:minecraftsilencearmourtrim:1299037815195177084>"
        });
            let muterol = db.fetch(`rol_${interaction.guild.id}`)
            let ucanEssek = interaction.guild.members.cache.get(kullanıcı)
            if (!ucanEssek) return interaction.reply("<a:arp:1318968419940569159> | Üyeyi bulamadım.")
            ucanEssek.roles.add(muterol)
            const embed = new EmbedBuilder()
            .setDescription(`<a:tik:1318968486671945840> | Başarılı bir şekilde <@!${kullanıcı}> isimli kişiye mute atıldı.
        `)
            interaction.update({embeds: [embed], components: [row, dmb]})
          }
        
          if (interaction.customId === "mutered_"+interaction.user.id) {
            const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('muteonay_'+interaction.user.id)
                    .setLabel('Onayla')
                    .setDisabled(true)
                    .setEmoji("1039607067729727519")
                    .setStyle('Success'),
                new Discord.ButtonBuilder()
                    .setCustomId('mutered_'+interaction.user.id)
                    .setLabel('İptal')
                    .setDisabled(true)
                    .setEmoji("1040649840394260510")
                    .setStyle('Danger'),
        
            );
            const dmb = deleteMessageButton(interaction, {
              label: "Mesajı sil.",
              style: Discord.ButtonStyle.Secondary,
              emoji: "<:minecraftsilencearmourtrim:1299037815195177084>"
        });
            const embed = new EmbedBuilder()
            .setDescription(`<a:tik:1318968486671945840> | Başarılı bir şekilde mute iptal edildi.
        `)
            interaction.update({embeds: [embed], components: [row, dmb]})
          }

            if (!interaction.isButton()) return;
            if (interaction.customId === "sunucukuronay_"+interaction.user.id) {
        
              interaction.guild.channels.cache.filter(mesajsil => {
                mesajsil.delete()
            })
        
            interaction.guild.roles.cache.filter(mesajsil => {
              mesajsil.delete()
          })

              interaction.guild.channels.create({name: "özel-chat", type: ChannelType.GuildText}).then(channel => {
                channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false });
                        })
                        interaction.guild.channels.create({name: "▬▬ ÖNEMLİ ▬▬", type: ChannelType.GuildCategory}).then(katagori1 => {
                            interaction.guild.channels.create({name: "📜・Kurallar", type: ChannelType.GuildText}).then(kurallar => {
                                const embed = new EmbedBuilder()
            .setTitle(':blue_book:  Sunucu Kuralları  :blue_book:')
            .setDescription(`
            **__${interaction.guild.name} Sunucu Kuralları__**                                    
            \`1)\` :blue_book: **・ Yetkililere Etiket Atmak Yasak! ・\`Mute\`・**
            \`2)\` :blue_book: **・ Küfür, Argo Kullanımı Yasak! ・\`Mute\`・**
            \`3)\` :blue_book: **・ Siyaset, Irkçılık ve Dini Konuları Konuşmak Yasak!  ・\`Ban\`・**
            \`4)\` :blue_book: **・ Reklam Yapmak Yasak! ・\`Ban\`・**
            \`5)\` :blue_book: **・ Flood Yapmak Yasak! ・\`Mute\`・**
            \`6)\` :blue_book: **・ Caps Lock ile Yazmak Yasak! ・\`Mute\`・**
            \`7)\` :blue_book: **・ Yetkilileri Dinlememek Yasak! ・\`Mute\`・**
            \`8)\` :blue_book: **・**\`Kurallara Herkes Uymak Zorundadır. Kuralları Okumayanlar, Bilmeyenler Yetkililerimizin Gözünde Okumuş Olarak Kabul Edilecektir.\`
            `)
            kurallar.send({embeds: [embed]})
            kurallar.setParent(katagori1.id)
            })
            interaction.guild.channels.create({name: "📢・Duyurular", type: ChannelType.GuildText}).then(duyuru => {
            duyuru.setParent(katagori1.id)
            })
            interaction.guild.channels.create({name: "🔰・Hoşgeldin", type: ChannelType.GuildText}).then(hg => {
                db.set(`hgbb_${interaction.guild.id}`, hg.id)
                hg.send("Buraya bakmana gerek yok! Senin için giriş çıkış sistemini ayarladım bile!")
                hg.setParent(katagori1.id)
                })
                interaction.guild.channels.create({name: "🔢・Oto Rol", type: ChannelType.GuildText}).then(rol => {
                    rol.send("**/oto-rol** Yazarak otomatik rolü ayarlayabilirsin.")
                    rol.setParent(katagori1.id)
                    })
            interaction.guild.channels.create({name: "📊・Oylama", type: ChannelType.GuildText}).then(oylama => {
                oylama.setParent(katagori1.id)
                })
                interaction.guild.channels.create({name: "🎉・Çekilişler", type: ChannelType.GuildText}).then(giveaway => {
                    giveaway.setParent(katagori1.id)
                    })
            })
            interaction.guild.channels.create({name: "▬▬ SOHBET KANALLARI ▬▬", type: ChannelType.GuildCategory}).then(katagori2 => {
            interaction.guild.channels.create({name: "💬・sohbet", type: ChannelType.GuildText}).then(sohbet => {
                const embed2 = new EmbedBuilder()
                .setTitle('ATOMLAND Bot - İyi günler diler.')
                .setDescription(`Unutma ${interaction.user}, senin için her şeyini ben ayarladım artık başka bir şey yapmana gerek yok.\n\nArtık sunucunu güvenli bir şekilde açabilirsin.`)
                .setColor("Blue")
                sohbet.send({embeds: [embed2]})
                sohbet.send("Hadi ilk mesajınız da benden olsun!")
            sohbet.setParent(katagori2)
            })
            interaction.guild.channels.create({name: "🎀・galeri", type: ChannelType.GuildText}).then(galeri => {
                db.set(`görselengel.${interaction.guild.id}`, galeri.id)
                galeri.send("Buraya bakmana gerek yok! Senin için görsel engel sistemini ayarladım bile!")
            galeri.setParent(katagori2)
            })
            interaction.guild.channels.create({name: "🚧・bot-komut", type: ChannelType.GuildText}).then(botkomut => {
            botkomut.setParent(katagori2)
            })
            interaction.guild.channels.create({name: "⭐・sunucu-destek", type: ChannelType.GuildText}).then(destek => {
            destek.setParent(katagori2)
            })
            })
            interaction.guild.channels.create({name: "▬▬ SESLİ SOHBET KANALLARI ▬▬", type: ChannelType.GuildCategory}).then(katagori3 => {
                interaction.guild.channels.create({name: "🔊・Sohbet 1", type: ChannelType.GuildVoice}).then(sohbet1 => {
                sohbet1.setParent(katagori3)
                })
                interaction.guild.channels.create({name: "🔊・Sohbet 2", type: ChannelType.GuildVoice}).then(sohbet2 => {
                    sohbet2.setParent(katagori3)
                    })
                    interaction.guild.channels.create({name: "🔊・Sohbet 3", type: ChannelType.GuildVoice}).then(sohbet3 => {
                        sohbet3.setParent(katagori3)
                        })
                        interaction.guild.channels.create({name: "🔓・Toplantı 1", type: ChannelType.GuildVoice}).then(toplantı => {
                            toplantı.setParent(katagori3)
                            })
                            interaction.guild.channels.create({name: "🔓・Toplantı 2", type: ChannelType.GuildVoice}).then(toplantı1 => {
                                toplantı1.setParent(katagori3)
                                })
            })
            
            interaction.guild.roles.create({ name: 'Kurucu', color: "Black", permissions: [PermissionsBitField.Flags.Administrator]}).then(rol => {
                client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.guild.ownerId).roles.add(rol)
                })
            interaction.guild.roles.create({ name: 'Admin', color: "Red", permissions: [PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.SendMessages]});
            interaction.guild.roles.create({ name: 'Mod', color: "Blue", permissions: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.SendMessages]});
            interaction.guild.roles.create({ name: 'Destek Ekibi', color: "Yellow", permissions: [PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.SendMessages]});
            interaction.guild.roles.create({ name: 'Özel Üye', color: "Purple", permissions: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]});
            interaction.guild.roles.create({ name: 'Üye', color: "White", permissions: [PermissionsBitField.Flags.SendMessages]});
            interaction.guild.roles.create({ name: 'Mute', color: "Grey", permissions: [PermissionsBitField.Flags.MuteMembers]});
            }
        
            if (interaction.customId === "sunucukurred_"+interaction.user.id) {
              interaction.update({content: `<a:tik:1318968486671945840> | Başarılı bir şekilde sunucu kurma iptal edildi!`, embeds: [], components: []})
            } 
            
            if (interaction.customId === "yenile_"+interaction.user.id) {
              const Uptime = moment
              .duration(client.uptime)
              .format(" D [gün], H [saat], m [dakika], s [saniye]");
                const row = new Discord.ActionRowBuilder()
              .addComponents(
          new Discord.ButtonBuilder()
          .setLabel("Yenile")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setEmoji('1039607071093567658')
          .setCustomId("yenile_"+interaction.user.id))
          .addComponents(
            new Discord.ButtonBuilder()
                .setEmoji("1039607063443161158")
                .setLabel(" ")
                .setStyle(Discord.ButtonStyle.Secondary)
                .setCustomId(".clearMessageButton_"+interaction.user.id)
          )
          let zaman = db.get(`botAcilis_`)
          let date = `<t:${Math.floor(zaman / 1000)}:R>`
          
          let servers = client.guilds.cache.size
          var yes1 = servers > 100
          var yes15 = servers > 150
          var yes2 = servers > 200
          var yes25 = servers > 250
          var yes3 = servers > 300
          var yes35 = servers > 350
          var yes4 = servers > 400
          var yes45 = servers > 450
          var yes5 = servers > 500
          
          var basDolu = "<:basdolu:1319151258694586502>"
          var basBos = "<:basbos:1319151312457175101>"
          var ortaDolu = "<:ortadolu:1319151089739894886>"
          var ortaBos = "<:ortabos:1319151178898215027>"
          var sonDolu = "<:sondolu:1319151368145076336>"
          var sonBos = "<:sonbos:1319151426953416786>"
          
            let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()
              const embed = new EmbedBuilder()
              .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
              .addFields(
                { name: '<a:UtilityDeveloper:1284009078829355050> Bot Sahibi', value: `**atomgameraga**`, inline: true },
                { name: "👥 Kullanıcılar", value: `${members}`, inline: true },
                { name: "🧩 Sunucular", value: `${servers}`, inline: true },
                { name: "📼 Bellek Kullanımı", value: `${(process.memoryUsage().heapUsed / 1024 / 512).toFixed(2)}MB`, inline: true },
                { name: "⏳ Açılma Süresi", value: `${date}`, inline: true },
                { name: "⏺️ Ping", value: `${client.ws.ping}`, inline: true },
                { name: `📋 Sunucu Hedef Barı [${servers}/500]`, value: `${yes1 ? `${basDolu}` : `${basBos}`}${yes15 ? `${ortaDolu}` : `${ortaBos}`}${yes2 ? `${ortaDolu}` : `${ortaBos}`}${yes25 ? `${ortaDolu}` : `${ortaBos}`}${yes3 ? `${ortaDolu}` : `${ortaBos}`}${yes35 ? `${ortaDolu}` : `${ortaBos}`}${yes4 ? `${ortaDolu}` : `${ortaBos}`}${yes45 ? `${ortaDolu}` : `${ortaBos}`}${yes5 ? `${sonDolu}` : `${sonBos}`}`, inline: true },
              )
              interaction.update({embeds: [embed], components: [row]})
              }

            if (interaction.customId === "botekle_everyone") {

              const zatenEklenmis = new EmbedBuilder()
              .setTitle("<a:arp:1318968419940569159> | Başarısız!")
              .setDescription("Zaten eklenmiş olan bir botun var!")
              .setColor("Red")
          let varmi = db.get(`ekledi_${interaction.user.id}${interaction.guild.id}`)
          if (varmi) return interaction.reply({ embeds: [zatenEklenmis], ephemeral: true })

              const lourityModal = new ModalBuilder()
              .setCustomId('form')
              .setTitle('Botlist Başvuru Formu')
            const a1 = new TextInputBuilder()
              .setCustomId('id')
              .setLabel('Bot ID Yazınız')
              .setStyle(TextInputStyle.Paragraph)
              .setMinLength(15)
              .setMaxLength(25)
              .setPlaceholder('Botunun ID (Kimliği) nedir?')
              .setRequired(true)
            const a2 = new TextInputBuilder()
              .setCustomId('prefix')
              .setLabel('Bot Prefixini Yazınız')
              .setStyle(TextInputStyle.Paragraph)
              .setMinLength(1)
              .setMaxLength(4)
              .setPlaceholder('Botunun Prefixi (Ön Ek) nedir?')
              .setRequired(true)
            
            const row = new ActionRowBuilder().addComponents(a1);
            const row3 = new ActionRowBuilder().addComponents(a2);
            lourityModal.addComponents(row, row3);
                  
              await interaction.showModal(lourityModal);
            }
        
          if (interaction.customId === "ayarlar_"+interaction.user.id) {
            let log = db.get(`log_${interaction.guild.id}`)
            let onayKanal = db.get(`onay_${interaction.guild.id}`)
            let botEkle = db.get(`botekle_${interaction.guild.id}`)
            let ayrildiLog = db.get(`ayrildiLog_${interaction.guild.id}`)
            let botRol = db.get(`botRol_${interaction.guild.id}`)
            let devRol = db.get(`devRol_${interaction.guild.id}`)
            let adminRol = db.get(`adminRol_${interaction.guild.id}`)
      
            const mesaj = new Discord.EmbedBuilder()
                .setTitle("Botlist Sistem Ayarları")
                .addFields(
                    { name: "**💾 Log Kanalı**", value: `<#${log || "Ayarlanmamış!"}>`, inline: true },
                    { name: "**👍 Onay Kanalı**", value: `<#${onayKanal || "Ayarlanmamış!"}>`, inline: true },
                    { name: "**🎈 Bot Ekle Kanalı**", value: `<#${botEkle || "Ayarlanmamış!"}>`, inline: true },
                    { name: "**📤 Ayrıldı Log Kanalı**", value: `<#${ayrildiLog || "Ayarlanmamış!"}>`, inline: true },
                    { name: "**🤖 Bot Rolü**", value: `<@&${botRol || "Ayarlanmamış!"}>`, inline: true },
                    { name: "**👨‍💻 Developer Rolü**", value: `<@&${devRol || "Ayarlanmamış!"}>`, inline: true },
                    { name: "**🔨 Yetkili Rolü**", value: `<@&${adminRol || "Ayarlanmamış!"}>` }
                )
                .setColor("Yellow")
      
            const yetki = new Discord.EmbedBuilder()
                .setTitle("<a:arp:1318968419940569159> | Yetersiz Yetki!")
                .setDescription("> Bu komutu kullanabilmek için `Yönetici` yetkisine ihtiyacın var!")
                .setFooter({ text: "ATOMLAND" })
                .setColor("Red")
            if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [yetki], ephemeral: true });
      
            interaction.reply({ embeds: [mesaj], ephemeral: true })
        }


        if (interaction.customId === "kapat_"+interaction.user.id) {
          const yetkii = new Discord.EmbedBuilder()
              .setTitle("<a:arp:1318968419940569159> | Yetersiz Yetki!")
              .setDescription("> Bu komutu kullanabilmek için `Yönetici` yetkisine ihtiyacın var!")
              .setFooter({ text: "ATOMLAND" })
              .setColor("Red")
    
          const embed1 = new Discord.EmbedBuilder()
              .setTitle("<a:tik:1318968486671945840> | Başarıyla Sıfırlandı!")
              .setDescription("> Botlist sistemi başarıyla **sıfırlandı**!")
              .setColor("Green")
    
          if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [yetkii], ephemeral: true })
    
          db.delete(`log_${interaction.guild.id}`)
          db.delete(`botRol_${interaction.guild.id}`)
          db.delete(`devRol_${interaction.guild.id}`)
          db.delete(`adminRol_${interaction.guild.id}`)
          db.delete(`onay_${interaction.guild.id}`)
          db.delete(`botekle_${interaction.guild.id}`)
          db.delete(`ayrildiLog_${interaction.guild.id}`)
		  db.delete(`botSira_${interaction.guild.id}`)
          return interaction.reply({ embeds: [embed1], ephemeral: true })
      }
      
      const mod = new ModalBuilder()
      .setCustomId('eklemenu')
      .setTitle('ATOMLAND - Özel Oda Kullanıcı Ekleme!')
        const e = new TextInputBuilder()
        .setCustomId('uyeid')
        .setLabel('Kullanıcı ID')
        .setStyle(TextInputStyle.Paragraph) 
        .setMinLength(10)
        .setPlaceholder('Eklemek istediğiniz kullanıcı IDsini girin.')
        .setRequired(true)
        const row2 = new ActionRowBuilder().addComponents(e);
        
        mod.addComponents(row2);

        if(interaction.customId === "ekle_"+interaction.user.id){
          let odasiz = db.fetch(`oda_${interaction.user.id}`)
          if (!odasiz) return interaction.reply({content: "<a:arp:1318968419940569159> | Sana Ait Bir Oda Bulamadım!", ephemeral: true})
          await interaction.showModal(mod);
        }

        const mod2 = new ModalBuilder()
        .setCustomId('eklemenu2')
        .setTitle('ATOMLAND - Özel Oda Kullanıcı Çıkarma!')
          const a = new TextInputBuilder()
          .setCustomId('cikarid')
          .setLabel('Kullanıcı ID')
          .setStyle(TextInputStyle.Paragraph) 
          .setMinLength(10)
          .setPlaceholder('Çıkarmak istediğiniz kullanıcı IDsini girin.')
          .setRequired(true)
          const row6 = new ActionRowBuilder().addComponents(a);
          
          mod2.addComponents(row6);

          if(interaction.customId === "çıkar_"+interaction.user.id){
            let odasiz = db.fetch(`oda_${interaction.user.id}`)
            if (!odasiz) return interaction.reply({content: "<a:arp:1318968419940569159> | Sana Ait Bir Oda Bulamadım!", ephemeral: true})
            await interaction.showModal(mod2);
          }

          if (interaction.customId === "unban_everyone") {
            const botlistadmin = db.fetch(`adminRol_${interaction.guild.id}`)
            if(!interaction.member.permissions.has(botlistadmin)) return interaction.reply({content: `<a:arp:1318968419940569159> | Bu butonu sadece <@&${botlistadmin}> yetkisi olanlar kullanabilir!`, ephemeral: true})
            let message = await interaction.channel.messages.fetch(interaction.message.id)
            const user = db.fetch(`user_${interaction.message.id}`)
            var data = db.fetch(`ekledi_${user}`)
      
            let lourityData = data
      
            const yetkiii = new Discord.EmbedBuilder()
                .setTitle("<a:arp:1318968419940569159> | Yetersiz Yetki!")
                .setDescription("> Bu komutu kullanabilmek için `Yönetici` yetkisine ihtiyacın var!")
                .setFooter({ text: "ATOMLAND" })
                .setColor("Red")
      
            const embed1 = new Discord.EmbedBuilder()
                .setTitle("<a:tik:1318968486671945840> | Başarılı!")
                .setDescription("> Botun banı başarıyla **kaldırıldı**!")
                .setColor("Green")
      
            if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetkiii], ephemeral: true });
      
            if (!lourityData) return interaction.reply({ content: "Bu botun banı zaten kaldırılmış!", ephemeral: true })
      
            interaction.guild.members.unban(lourityData).catch(() => { })
            message.delete()
            return interaction.reply({ embeds: [embed1], ephemeral: true })
        }

        if (interaction.customId === "reddet_everyone") {

          const botlistadmin = db.fetch(`adminRol_${interaction.guild.id}`)
          if(!interaction.member.permissions.has(botlistadmin)) return interaction.reply({content: `<a:arp:1318968419940569159> | Bu butonu sadece <@&${botlistadmin}> yetkisi olanlar kullanabilir!`, ephemeral: true})
      
            let message = await interaction.channel.messages.fetch(interaction.message.id)
            let log = db.get(`log_${interaction.guild.id}`)
            var data = db.fetch(`bot_${interaction.message.id}`)
            var uye = data.user
            var bot = data.bot

            if (!interaction.member.roles.cache.has(botlistadmin)) return interaction.reply({ content: "<a:arp:1318968419940569159> | Bu işlemi gerçekleştirmek için <@&" + botlistadmin + "> rolüne sahip olmalısın!", ephemeral: true })
      
            let a = await client.users.fetch(bot);
            let avatar = a.avatar
            let link = "https://cdn.discordapp.com/avatars/" + bot + "/" + avatar + ".png?size=1024"
      
            const embed = new EmbedBuilder()
                .setTitle("<a:arp:1318968419940569159> | Bot Reddedildi!")
                .setDescription("<@" + data.bot + "> adlı botun başvurusu maalesef reddedildi!")
                .setThumbnail(link)
                .setColor("Red")
      
            client.channels.cache.get(log).send({ content: "<@" + uye + ">", embeds: [embed] })
            message.delete()
        }
		
		        if(interaction.customId === `ticketnasilacilir_everyone`) {
        const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: "ATOMLAND Destek Menüsü", iconURL: client.user.displayAvatarURL({ dynamic: true })})
        .setTitle("・Destek talebi nasıl oluşturabilirsin.")
        .setDescription("**Destek Talebi Oluştur** butonuna tıkladıktan sonra karşına bir form gelecektir. O formu doldurduktan sonra destek talebin başarılı bir şekilde oluşturulacaktır.")
        .setImage(`https://r.resimlink.com/Kdyznms.png`)
        .setColor('Blue')
          interaction.reply({ embeds: [embed], ephemeral: true })
        }

                if(interaction.customId === `ticketolustur_everyone`) {
          
          const find = db.fetch(`ticketUser_${interaction.user.id}${interaction.guild.id}`)
          if(find) {
            const ticketVar = new Discord.EmbedBuilder()
            .setDescription(`<a:arp:1318968419940569159> Zaten bir talebin bulunmakta.`)
            return interaction.reply({ embeds: [ticketVar], ephemeral: true })
          }

          const ticketmodal = new Discord.ModalBuilder()
          .setCustomId('ticketforms')
          .setTitle('Destek Oluşturma Formu');
    
          const ticketInput = new Discord.TextInputBuilder()
          .setCustomId('ticketInput')
          .setLabel("Destek Oluşturma Sebebiniz Nedir?")
          .setRequired(true)  
          .setStyle(Discord.TextInputStyle.Short);
    
      
          const afirstActionRow = new Discord.ActionRowBuilder().addComponents(ticketInput);
    
          ticketmodal.addComponents(afirstActionRow);
    
          await interaction.showModal(ticketmodal);
          
        }
        
        if(interaction.customId === `ticketClose_everyone`) {
          interaction.channel.permissionOverwrites.set([
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },        
          ]);
          const row = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`ticketDelete_everyone`)
              .setLabel('Destek silinsin.')
              .setEmoji("🗑️")
              .setStyle(Discord.ButtonStyle.Secondary),
          );
          const ticketClose = new Discord.EmbedBuilder()
          .setDescription(`<a:tik:1318968486671945840> | Bu destek talebi kapatılmıştır.`)
          .setColor('Green')
          interaction.reply({ embeds: [ticketClose], components: [row] })
        }

        if(interaction.customId === `ticketDelete_everyone`) {

         const chnl = db.fetch(`ticketChannelUser_${interaction.guild.id}${interaction.channel.id}`);
         const x = chnl.user;

         const adam = await interaction.guild.members.cache.find(user => user.id === x);
         const usr = db.fetch(`ticketUser_${x}${interaction.guild.id}`);

          const ticketLog = db.fetch(`ticketKanal_${interaction.guild.id}`)
          const ticketcloseembed = new EmbedBuilder()
          .setTitle(`${adam.user.tag} adlı kişinin destek verileri.`)
          .addFields(
            { name: "Destek Açan: <:block:1065690244634124500>", value: `<@${usr.whOpen}>`, inline: true },
            { name: "Desteğin Kapatılış Tarihi:", value: `<t:${parseInt(Date.now() / 1000)}:R>`, inline: true  },
             { name: '\u200B', value: '\u200B' },
            { name: "Desteği Kapatan:", value: `<@${interaction.user.id}>`, inline: true },
            { name: "Desteğin Açılış Tarihi:", value: `<t:${parseInt(usr.date / 1000)}:R>`, inline: true  },
                  )
          .setColor('Green')
          .setThumbnail(`${adam.user.displayAvatarURL()}`)
          client.channels.cache.get(ticketLog).send({embeds: [ticketcloseembed]})

          db.delete(`ticketChannelUser_${interaction.guild.id}${interaction.channel.id}`);
          db.delete(`ticketUser_${x}${interaction.guild.id}`);

          return interaction.channel.delete();
        }
      
if(interaction.customId === `benıdogrula_everyone_${interaction.guild.id}${interaction.user.id}`)
        {
          const rmodal = new Discord.ModalBuilder()
      .setCustomId('rcaptcha')
      .setTitle('Doğrulama Sekmesi');

      const rcaptchaInput = new Discord.TextInputBuilder()
      .setCustomId('rcaptchaInput')
      .setLabel("Doğrulama Kodunuz nedir?")
      .setMaxLength(6)
      .setMinLength(6)
      .setRequired(true)  
      .setStyle(Discord.TextInputStyle.Short);

  
      const firstActionRow = new Discord.ActionRowBuilder().addComponents(rcaptchaInput);

      rmodal.addComponents(firstActionRow);

      await interaction.showModal(rmodal);
        }
      
      if(interaction.customId === `randomGöster_everyone_${interaction.guild.id}${interaction.user.id}`)
        {
          return interaction.reply({ embeds: [
            new Discord.EmbedBuilder()
            .setColor("#36393F")
            .setDescription('💮 **|** Kodun: `'+db.fetch(`beklenıyor_${interaction.guild.id}${interaction.user.id}`)+'`')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
          ], ephemeral: true })
        }
		
		        if(interaction.customId === `giriscikismesaj_`+interaction.user.id) {
          const giriscikismodal = new Discord.ModalBuilder()
      .setCustomId('giriscikis')
      .setTitle('Mesaj Ayarlama Formu');

      const girismesaj = new Discord.TextInputBuilder()
      .setCustomId('girismesaj')
      .setLabel("Giriş mesajınızı yazınız!")
      .setMaxLength(100)
      .setMinLength(1)
      .setRequired(true)  
      .setStyle(Discord.TextInputStyle.Short);

      const cikismesaj = new Discord.TextInputBuilder()
      .setCustomId('cikismesaj')
      .setLabel("Çıkış mesajınızı yazınız!")
      .setMaxLength(100)
      .setMinLength(1)
      .setRequired(true)  
      .setStyle(Discord.TextInputStyle.Short);

  
      const firstActionRow = new Discord.ActionRowBuilder().addComponents(girismesaj);
      const twoActionRow = new Discord.ActionRowBuilder().addComponents(cikismesaj);

      giriscikismodal.addComponents(firstActionRow, twoActionRow);

      await interaction.showModal(giriscikismodal);
        }

        if(interaction.customId === `giriscikismesajsifirla_`+interaction.user.id) {
          const sayacmessage = db.fetch(`sayacmessage_${interaction.guild.id}`)
          
          if (!sayacmessage) {
              const date = new EmbedBuilder()
              .setDescription(`<a:arp:1318968419940569159> | Bu sistem zaten kapalı!`)
          
          return interaction.reply({ embeds: [date], ephemeral: true })
          }
          const row1 = new Discord.ActionRowBuilder()

          .addComponents(
              new Discord.ButtonBuilder()
                  .setLabel("Giriş Çıkış Mesajını Ayarla!")
                  .setStyle(Discord.ButtonStyle.Secondary)
                  .setCustomId("giriscikismesaj_"+interaction.user.id)
          )
        
          .addComponents(
              new Discord.ButtonBuilder()
                  .setLabel("Giriş Çıkış Mesajını Sıfırla!")
                  .setDisabled(true)
                  .setStyle(Discord.ButtonStyle.Secondary)
                  .setCustomId("giriscikismesajsifirla_"+interaction.user.id)
          )
          const embed = new EmbedBuilder()
          .setColor(0x2F3136)
          .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()} ` })
          .setDescription("<a:tik:1318968486671945840> **|** Giriş çıkış mesajı sıfırlandı!")
          db.delete(`sayacmessageDate_${interaction.guild.id}`)
          db.delete(`sayacmessage_${interaction.guild.id}`)

          return interaction.update({ embeds: [embed], components: [row1] })
      
        }

          }

  };

//
