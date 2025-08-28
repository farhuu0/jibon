const fs = require("fs-extra");

module.exports = {
  config: {
    name: "tagall",
    version: "2.0",
    author: "Farhan",
    countDown: 5,
    role: 0,
    shortDescription: "Tag everyone with numbered list",
    longDescription: "Mention all group members with numbers in a list",
    category: "group",
    guide: {
      en: "{pn} [optional message]"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (event.isGroup === false) {
        return api.sendMessage("❌ এই কমান্ড শুধু গ্রুপে ব্যবহার করা যাবে!", event.threadID, event.messageID);
      }

      const threadInfo = await api.getThreadInfo(event.threadID);
      const mentions = [];
      let msg = args.join(" ") || "📢 সবাই খেয়াল করো!";
      msg += "\n\n👥 Member List:\n";

      let i = 1;
      for (const user of threadInfo.userInfo) {
        mentions.push({
          tag: user.name,
          id: user.id
        });
        msg += `${i++}. @${user.name}\n`;
      }

      api.sendMessage({
        body: msg,
        mentions
      }, event.threadID, event.messageID);

    } catch (e) {
      console.error(e);
      api.sendMessage("⚠️ সবাইকে ট্যাগ করা গেল না!", event.threadID, event.messageID);
    }
  }
};
