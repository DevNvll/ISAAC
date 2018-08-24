import axios from "axios";
import cheerio from "cheerio";
import Discord from "discord.js";

function getData(html) {
  const $ = cheerio.load(html);
  const getValue = selector => $(selector).text();
  const error404 = getValue(".alert");
  const username = getValue(".main > h1:nth-child(2)");
  const timePlayed = getValue(
    "div.stats-stat:nth-child(1) > div:nth-child(3)"
  ).trim();
  const playerLevel = getValue(
    "div.stats-stat:nth-child(2) > div:nth-child(3)"
  );
  const dzLevel = getValue("div.stats-stat:nth-child(3) > div:nth-child(3)");
  const kills = getValue("div.stats-stat:nth-child(5) > div:nth-child(3)");
  const isSteam = getValue(".ion-steam") !== null;
  const rogueKills = getValue("div.stats-stat:nth-child(8) > div:nth-child(3)");
  if (!error404)
    return {
      username,
      timePlayed,
      playerLevel,
      dzLevel,
      kills,
      rogueKills,
      isSteam
    };
  else return null;
}

export default {
  onBotMention(bot, channel, message) {
    if (message.content.split(" ")[1] === "tracker") {
      channel.startTyping();
      const uplayName = message.content.split(" ")[2];
      axios
        .get("https://divisiontracker.com/profile/uplay/" + uplayName)
        .then(({ data }) => {
          const playerData = getData(data);
          if (!playerData) {
            channel.stopTyping();
            message.reply("user was not found.");
            return;
          }
          const {
            username,
            timePlayed,
            playerLevel,
            dzLevel,
            kills,
            rogueKills,
            isSteam
          } = playerData;
          const embed = new Discord.RichEmbed()
            .setAuthor(username)
            .setColor("#FB6F0D")
            .setDescription(
              (isSteam ? `**Steam**: ${username}` : "") +
                `\n**Uplay**: ${uplayName}`
            )
            .setThumbnail(
              "https://cdn.division.zone/uploads/2014/08/the-division-shd-logo.jpg"
            )
            .setURL("https://divisiontracker.com/profile/uplay/" + uplayName)
            .setTimestamp()
            .addField("Time played", timePlayed)
            .addField("Player level", playerLevel)
            .addField("Darkzone level", dzLevel)
            .addField("Kills", kills)
            .addField("Rogue kills", rogueKills)
            .setFooter(
              "Data from Division Tracker",
              "http://divisiontracker.com/Images/General/logo.png"
            );
          channel.stopTyping();
          message.reply("", { embed });
        })
        .catch(err => {
          channel.stopTyping();
          console.log(err);
        });
    }
  }
};
