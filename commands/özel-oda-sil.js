const { PermissionsBitField } = require("discord.js");
const db = require("croxydb");
module.exports = {
  name: "özel-oda-sil",
  description: " Özel odanı silersin.",
  type: 1,
  options: [],
  run: async (client, interaction) => {
    let odasi = db.fetch(`oda_${interaction.user.id}`);
    if (!odasi)
      return interaction.reply(
        "<a:arp:1318968419940569159> | Sana ait bir oda bulamadım!",
      );
    interaction.reply("<a:tik:1318968486671945840> | Odan Başarıyla Silindi!");
    interaction.guild.channels.delete(odasi);
  },
};
