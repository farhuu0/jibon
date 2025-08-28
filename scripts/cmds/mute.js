let mutedThreads = new Set();

module.exports = {
  config: {
    name: "mute",
    version: "1.0",
    author: "Farhan",
    role: 0,
    shortDescription: "Mute bot in group",
    longDescription: "Mute bot so it won’t respond in this group",
    category: "group",
    guide: {
      en: "{pn} [minutes]"
    }
  },

  onStart: async function ({ api, event, args }) {
    if (!event.isGroup) return api.sendMessage("❌ শুধু গ্রুপে ব্যবহার করা যাবে!", event.threadID);
    let minutes = parseInt(args[0]) || 5;
    mutedThreads.add(event.threadID);
    api.sendMessage(`🤫 বট ${minutes} মিনিটের জন্য মিউট করা হলো !`, event.threadID);

    setTimeout(() => {
      mutedThreads.delete(event.threadID);
      api.sendMessage("✅ Bot is back up and running.!", event.threadID);
    }, minutes * 60000);
  },

  onChat: async function ({ event }) {
    if (mutedThreads.has(event.threadID)) return false;
  }
};
