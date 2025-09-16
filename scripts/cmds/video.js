const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "video",
    version: "1.0",
    author: "Farhan",
    countDown: 5,
    role: 0,
    shortDescription: "Send a video",
    longDescription: "This command sends a video file",
    category: "media",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const videoPath = path.join(__dirname, "assets", "hot"); // এখানে ভিডিও রাখতে হবে
      if (!fs.existsSync(videoPath)) {
        return api.sendMessage("⚠️ ভিডিও ফাইল পাওয়া যায়নি!", event.threadID, event.messageID);
      }

      api.sendMessage(
        {
          body: "🎬 এখানে তোমার ভিডিও:",
          attachment: fs.createReadStream(videoPath)
        },
        event.threadID,
        event.messageID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ ভিডিও পাঠাতে সমস্যা হয়েছে!", event.threadID, event.messageID);
    }
  }
};
