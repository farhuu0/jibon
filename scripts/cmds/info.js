const moment = require('moment-timezone');
const axios = require('axios');

module.exports = {
  config: {
    name: "info",
    aliases: ["inf", "in4"],
    version: "2.0",
    author: "Eren + Modified by Farhan",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Sends information about the bot and admin along with a video."
    },
    longDescription: {
      en: "Sends information about the bot and admin along with a video."
    },
    category: "Information",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    this.sendInfo(message);
  },

  onChat: async function ({ event, message }) {
    if (event.body && event.body.toLowerCase() === "info") {
      this.sendInfo(message);
    }
  },

  sendInfo: async function (message) {
    const botName = "✰→ ғᴀʀʜᴀɴ ʙᴏᴛ ←✰";
    const authorName = "Fᴀʀʜᴀɴ";
    const authorFB = "https://www.facebook.com/farhuu.2.0";
    const authorInsta = "nai";
    const status = "𝗦𝗶𝗻𝗴𝗹𝗲";

    const now = moment().tz('Asia/Dhaka');
    const time = now.format('h:mm:ss A');

    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

    const videoUrl = "https://files.catbox.moe/pxuoqo.mp4"; // dont use imgur url for this cmd

    const body = `
┏━━━━━━━━━━━━━━━┓
┃ 👑 𝗔𝗱𝗺𝗶𝗻 𝗜𝗻𝗳𝗼
┃ ✦ Name: ${authorName}
┃ ✦ Facebook: ${authorFB}
┃ ✦ Instagram: ${authorInsta}
┃ ✦ Status: ${status}
┃
┃ 🤖 𝗕𝗼𝘁 𝗗𝗲𝘁𝗮𝗶𝗹𝘀
┃ ✦ Name: ${botName}
┃ ✦ Time: ${time}
┃ ✦ Uptime: ${uptimeString}
┗━━━━━━━━━━━━━━━┛

✨ Stay positive, stay connected.
I may not be perfect, but I’ll always be here for you ❤️`;

    const response = await axios.get(videoUrl, { responseType: 'stream' });

    message.reply({
      body,
      attachment: response.data
    });
  }
};
