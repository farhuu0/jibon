const axios = require("axios");

module.exports = {
  config: {
    name: "4k",
    aliases: ["upscale"],
    version: "1.1",
    role: 0,
    author: "Fahim_Noob",
    countDown: 5,
    longDescription: "Upscale images to stunning 4K resolution.",
    category: "image",
    guide: {
      en: "✨ 𝓤𝓼𝓮: ${pn} – 𝓡𝓮𝓹𝓵𝔂 𝓽𝓸 𝓪𝓷𝔂 𝓲𝓶𝓪𝓰𝓮 𝓽𝓸 𝓾𝓹𝓼𝓬𝓪𝓵𝓮 𝓲𝓽 𝓽𝓸 𝟜𝓚 ✨"
    }
  },

  onStart: async function ({ message, event }) {
    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return message.reply("📸 𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚒𝚖𝚊𝚐𝚎 𝚝𝚘 𝚞𝚙𝚜𝚌𝚊𝚕𝚎 𝚒𝚝.");
    }

    const imgurl = encodeURIComponent(event.messageReply.attachments[0].url);
    const noobs = 'xyz';
    const upscaleUrl = `https://smfahim.${noobs}/4k?url=${imgurl}`;

    message.reply("⏳ 𝖀𝖕𝖘𝖈𝖆𝖑𝖎𝖓𝖌 𝖞𝖔𝖚𝖗 𝖎𝖒𝖆𝖌𝖊 𝖎𝖓 𝖚𝖑𝖙𝖗𝖆 𝟒𝕂... 𝕭𝖔𝖘𝖘 😎", async (err, info) => {
      try {
        const { data: { image } } = await axios.get(upscaleUrl);
        const attachment = await global.utils.getStreamFromURL(image, "4k-upscaled.png");

        message.reply({
          body: "✅ 𝓗𝓮𝓻𝓮'𝓼 𝔂𝓸𝓾𝓻 𝓼𝓽𝓾𝓷𝓷𝓲𝓷𝓰 𝟜𝓚 𝓲𝓶𝓪𝓰𝓮, 𝓑𝓸𝓼𝓼 📸✨",
          attachment: attachment
        });

        let processingMsgID = info.messageID;
        message.unsend(processingMsgID);

      } catch (error) {
        console.error(error);
        message.reply("❌ 𝕺𝖔𝖕𝖘! 𝕾𝖔𝖒𝖊𝖙𝖍𝖎𝖓𝖌 𝖜𝖊𝖓𝖙 𝖜𝖗𝖔𝖓𝖌. 𝕿𝖗𝖞 𝖆𝖌𝖆𝖎𝖓 𝖑𝖆𝖙𝖊𝖗.");
      }
    });
  }
};
