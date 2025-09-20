const axios = require("axios");
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");

module.exports = {
  config: {
    name: "flux2",
    version: "1.0",
    author: "Aryan Chauhan",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Generate images using Flux2 AI" },
    longDescription: { en: "Send a text prompt and the bot will generate an image using the Flux2 API." },
    category: "ai",
    guide: { en: "{pn} <prompt>\n\nExample:\n{pn} cute cat sitting on a tree" }
  },

  onStart: async function ({ api, args, event }) {
    if (!args[0]) return api.sendMessage("❌ Please provide a prompt for Flux2.", event.threadID, event.messageID);

    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

    const prompt = args.join(" ");
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const apiUrl = `https://aryanapi.up.railway.app/api/flux2?prompt=${encodeURIComponent(prompt)}&steps=4`;
      const res = await axios.get(apiUrl, { responseType: "stream", timeout: 60000 });

      const filename = `flux2_${Date.now()}.jpg`;
      const filepath = path.join(CACHE_DIR, filename);
      const writer = fs.createWriteStream(filepath);

      res.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage({
          body: `✨ Flux2 image generated for prompt: "${prompt}"`,
          attachment: fs.createReadStream(filepath)
        }, event.threadID, () => { 
          try { fs.unlinkSync(filepath); } catch {} 
        }, event.messageID);

        api.setMessageReaction("✅", event.messageID, () => {}, true);
      });

      writer.on("error", (err) => {
        console.error("❌ File write error:", err.message);
        api.sendMessage("❌ Error saving the generated Flux2 image.", event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
      });

    } catch (err) {
      console.error("❌ Error generating Flux2 image:", err.message);
      api.sendMessage("❌ Failed to generate Flux2 image.", event.threadID, event.messageID);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};
