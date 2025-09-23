const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "addown.json");

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ ownerUID: "100080736881604", running: false }));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "addown",
    version: "2.0",
    author: "T A N J I L 🎀",
    role: 2, // admin only
    shortDescription: { en: "Owner auto-add & management system" },
    longDescription: { en: "Add owner to groups automatically or via commands." },
    category: "system",
  },

  onStart: async function () {},

  onEvent: async function ({ api, event }) {
    if (event.logMessageType === "log:subscribe") {
      const botID = await api.getCurrentUserID();
      if (event.logMessageData?.addedParticipants?.some(p => p.userFbId == botID)) {
        const data = loadData();
        try {
          await api.addUserToGroup(data.ownerUID, event.threadID);
          console.log(`✅ Owner (${data.ownerUID}) auto-added to group ${event.threadID}`);
        } catch (e) {
          console.error("❌ Auto add failed:", e.message);
        }
      }
    }
  },

  onChat: async function ({ api, event, args }) {
    if (args[0] !== "/addown") return;

    const data = loadData();

    // 📘 HELP
    if (!args[1] || args[1] === "-help") {
      return api.sendMessage(
        `📘 Addown Command Help:\n\n` +
        `1️⃣ /addown -all\n→ Add owner to all groups safely (30 sec delay each).\n\n` +
        `2️⃣ /addown -status\n→ Show how many groups have the owner and how many don’t.\n\n` +
        `3️⃣ /addown -set <UID>\n→ Set a new Owner UID without editing code.\n\n` +
        `4️⃣ /addown -stop\n→ Stop running /addown -all process and show summary.\n\n` +
        `5️⃣ Auto on new group\n→ Whenever bot joins a new group, owner is auto added.\n\n` +
        `6️⃣ /addown -help\n→ Show this help menu.`,
        event.threadID
      );
    }

    // 🔹 SET OWNER
    if (args[1] === "-set" && args[2]) {
      data.ownerUID = args[2];
      saveData(data);
      return api.sendMessage(`✅ Owner UID updated to: ${args[2]}`, event.threadID);
    }

    // 🔹 STATUS
    if (args[1] === "-status") {
      const threads = await api.getThreadList(100, null, ["INBOX"]);
      let has = 0, not = 0;
      for (const t of threads) {
        try {
          const info = await api.getThreadInfo(t.threadID);
          if (info.participantIDs.includes(data.ownerUID)) has++;
          else not++;
        } catch {}
      }
      return api.sendMessage(
        `📊 Owner Status:\n✅ In groups: ${has}\n❌ Missing in groups: ${not}`,
        event.threadID
      );
    }

    // 🔹 ADD OWNER TO ALL
    if (args[1] === "-all") {
      if (data.running) return api.sendMessage("⚠ Already running. Use /addown -stop to cancel.", event.threadID);
      data.running = true;
      saveData(data);

      const threads = await api.getThreadList(100, null, ["INBOX"]);
      let added = 0, failed = 0, skipped = 0;

      api.sendMessage(`🚀 Starting to add owner (${data.ownerUID}) to all groups...`, event.threadID);

      for (const t of threads) {
        if (!data.running) break;
        try {
          const info = await api.getThreadInfo(t.threadID);
          if (info.participantIDs.includes(data.ownerUID)) {
            skipped++;
          } else {
            await api.addUserToGroup(data.ownerUID, t.threadID);
            added++;
          }
        } catch {
          failed++;
        }
        await new Promise(r => setTimeout(r, 30000)); // ⏳ 30s delay
      }

      data.running = false;
      saveData(data);

      return api.sendMessage(
        `📌 Process complete:\n✅ Added: ${added}\n⏭ Skipped: ${skipped}\n❌ Failed: ${failed}`,
        event.threadID
      );
    }

    // 🔹 STOP
    if (args[1] === "-stop") {
      if (!data.running) return api.sendMessage("⚠ No process running.", event.threadID);
      data.running = false;
      saveData(data);
      return api.sendMessage("🛑 Stopped /addown -all process. Summary will show at end.", event.threadID);
    }
  }
};
