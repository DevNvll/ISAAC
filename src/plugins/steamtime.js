import request from "axios";
import some from "lodash/some";

const STEAM_KEY = process.env.STEAM_KEY;

export default {
  name: "Steam Time",
  description: "Get user's played hours on steam (owned games only)",
  permissions: [],
  onBotMention(bot, channel, message) {
    if (message.content.split(" ")[1] === "steamtime") {
      resolveId(message.content.split(" ")[2], time => {
        time
          ? message.reply("Total hours played: " + time)
          : message.reply(message, "Profile is private or doesn't exist");
      });
    }
  }
};

const getTime = (userid, callback) => {
  let hours = 0;
  request(
    "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" +
      STEAM_KEY +
      "&steamid=" +
      userid +
      "&format=json"
  ).then(res => {
    if (some(res.data.response)) {
      for (let game in res.data.response.games) {
        hours =
          hours + parseInt(res.data.response.games[game].playtime_forever / 60);
      }
      callback(hours);
    } else {
      callback();
    }
  });
};

const resolveId = (id, callback) => {
  if (id.match(/^7656119[0-9]{10}$/i)) {
    getTime(id, time => {
      callback(time);
    });
  } else {
    request(
      "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" +
        STEAM_KEY +
        "&vanityurl=" +
        id
    ).then(res => {
      getTime(res.data.response.steamid, time => {
        callback(time);
      });
    });
  }
};
