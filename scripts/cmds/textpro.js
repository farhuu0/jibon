const axios = require("axios");
const fs = require("fs");
const path = require("path");

const HEADERS = {
 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
 "Referer": "https://textpro.me/",
};

module.exports = {
 config: {
 name: "textpro",
 aliases: ["tp"],
 version: "1.0",
 author: "Team Calyx",
 countDown: 5,
 role: 0,
 description: {
 en: "Generate text effect images from TextPro"
 },
 category: "image",
 usages: "list | <effect number> | <your text>",
 cooldowns: 5,
 },

 onStart: async function({ api, event, args }) {
 const usageMessage = `
ðŸ“Œ *TextPro Command Usage* ðŸ“Œ

1ï¸âƒ£ List available text effects:
â€¢ tp list
 â€” Show all effects

2ï¸âƒ£ Generate a text effect image:
â€¢ tp <effect_number> | <your text>
 â€” Example: tp 3 | Hello World`;

 if (!args.length || args[0].toLowerCase() === "help") {
 return api.sendMessage(usageMessage, event.threadID, event.messageID);
 }

 const subcmd = args[0].toLowerCase();

 
 if (subcmd === "list") {
 try {
 const res = await axios.get("https://textpro-zeta.vercel.app/list", { headers: HEADERS });
 if (!res.data.success) {
 return api.sendMessage("âŒ Failed to fetch effect list.", event.threadID, event.messageID);
 }

 const allEffects = res.data.chunks.flat();

 if (!allEffects.length) {
 return api.sendMessage("âŒ No effects found.", event.threadID, event.messageID);
 }

 const chunkSize = 50;
 for (let i = 0; i < allEffects.length; i += chunkSize) {
 const chunk = allEffects.slice(i, i + chunkSize);
 const listText = chunk.map(e => `${e.number}. ${e.title}`).join("\n");
 await api.sendMessage(`ðŸŽ¨ TextPro Effects (${i + 1}-${i + chunk.length}):\n${listText}`, event.threadID);
 }

 return;

 } catch (err) {
 return api.sendMessage(`âŒ Error fetching effect list: ${err.message}`, event.threadID, event.messageID);
 }
 }

 
 const input = args.join(" ").split("|");
 const effectInput = input[0].trim();
 const text = input[1] ? input[1].trim() : "";

 if (!text) {
 return api.sendMessage("âŒ Please provide text after '|'.", event.threadID, event.messageID);
 }

 if (isNaN(effectInput)) {
 return api.sendMessage("âŒ Effect number must be a number from the list.", event.threadID, event.messageID);
 }

 const effectNumber = parseInt(effectInput, 10);

 try {
 const res = await axios.get("https://textpro-zeta.vercel.app/list", { headers: HEADERS });
 if (!res.data.success) {
 return api.sendMessage("âŒ Failed to fetch effect list.", event.threadID, event.messageID);
 }

 const allEffects = res.data.chunks.flat();
 const effect = allEffects.find(e => e.number === effectNumber);

 if (!effect) {
 return api.sendMessage(`âŒ Effect number ${effectNumber} not found. Use 'tp list' to see all effects.`, event.threadID, event.messageID);
 }

 const genRes = await axios.get("https://textpro-zeta.vercel.app/textpro", {
 params: {
 text,
 effectNumber,
 },
 headers: HEADERS,
 });

 if (!genRes.data.success) {
 return api.sendMessage("âŒ Failed to generate image.", event.threadID, event.messageID);
 }

 const imageUrl = genRes.data.imageUrl.startsWith("http") ? genRes.data.imageUrl : `https:${genRes.data.imageUrl}`;

 const imgRes = await axios.get(imageUrl, { responseType: "arraybuffer", headers: HEADERS });

 const cacheDir = path.join(__dirname, "cache");
 if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

 const ext = path.extname(new URL(imageUrl).pathname) || ".jpg";
 const fileName = `textpro_${Date.now()}${ext}`;
 const filePath = path.join(cacheDir, fileName);

 fs.writeFileSync(filePath, Buffer.from(imgRes.data, "binary"));

 await api.sendMessage({
 body: `âœ… Text: ${genRes.data.text}\nðŸŽ¨ Effect: ${genRes.data.effectTitle}`,
 attachment: fs.createReadStream(filePath)
 }, event.threadID, event.messageID);

 fs.unlinkSync(filePath);

 } catch (err) {
 console.error(err);
 return api.sendMessage(`âŒ Error: ${err.message}`, event.threadID, event.messageID);
 }
 }
};
