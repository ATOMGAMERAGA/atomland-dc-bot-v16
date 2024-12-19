const db = require("croxydb");

module.exports = {
  name: "kayıt-isim-sıfırla",
  description: " Kayıt ismini sıfırlarsın!",
  options: [],
  
  run: async(client, interaction) => {

    const findDatabase = db.fetch(`kayıtlıuye_${interaction.user.id}`) ? true : false;

    if(findDatabase) {
      db.delete(`kayıtlıuye_${interaction.user.id}`)
      interaction.member.setNickname(`${interaction.user.username}`)

      return interaction.reply({ embeds: [{ description: "<a:tik:1318968486671945840> | İsminiz başarıyla sıfırlandı." }] })
    } else {
      return interaction.reply({ embeds: [{ description: "<a:arp:1318968419940569159> | İsminiz kayıt sisteminde kayıtlı değildir." }] })
    }
  }
}