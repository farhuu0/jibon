const os = require("os");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up2"],
    version: "3.0",
    author: "xnil6x + Farhan",
    role: 0,
    shortDescription: "Show bot uptime info",
    longDescription: "Display stylish uptime, system stats, RAM, prefix, threads, etc.",
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ message, threadsData }) {
    // Bot uptime
    const uptime = process.uptime();
    const days = Math.floor(uptime / (60 * 60 * 24));
    const hours = Math.floor((uptime % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // System info
    const cpu = os.cpus()[0].model;
    const cores = os.cpus().length;
    const platform = os.platform();
    const arch = os.arch();
    const nodeVersion = process.version;
    const hostname = os.hostname();

    // Memory
    const totalMem = os.totalmem() / 1024 / 1024; // MB
    const freeMem = os.freemem() / 1024 / 1024;   // MB
    const usedMem = totalMem - freeMem;
    const ramUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);

    // Load avg (CPU usage approx)
    const loadAvg = os.loadavg()[0].toFixed(2);

    // Extra info
    const prefix = global.GoatBot.config.PREFIX || "/";
    const totalThreads = (await threadsData.getAll() || []).length;
    const totalCommands = global.GoatBot.commands.size;

    // Time & Date
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const time = now.toLocaleTimeString("en-US");

    // Ping
    const ping = Date.now() - message.timestamp;
    const status = ping < 1000 ? "✅ Good" : ping < 3000 ? "⚠️ Moderate" : "❌ Slow";

    // Fancy dashboard box
    const box = `
✦⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅✦
 🅄🄿🅃🄸🄼🄴 🄳🄰🅂🄷🄱🄾🄰🅁🄳
✦⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅✦

 ♡ ∩_∩
 （„• ֊ •„)♡
 ╭─∪∪─────────────────╮
 │ 🕒 Runtime   : ${uptimeString}
 │ 🛜 OS         : ${platform} ${arch}
 │ 🖥 CPU        : ${cpu} (${cores} cores)
 │ 💾 Storage    : ${(usedMem/1024).toFixed(2)}GB / ${(totalMem/1024).toFixed(2)}GB
 │ 📈 CPU Usage  : ${loadAvg}%
 │ 🧠 RAM Used   : ${usedMem.toFixed(2)} MB (${ramUsagePercent}%)
 ├─────────────────────┤
 │ 📅 Date      : ${date}
 │ ⏳ Time      : ${time}
 │ 👥 Users     : ${totalCommands}
 │ 🧵 Threads   : ${totalThreads}
 │ 📶 Ping      : ${ping}ms
 │ 🚦 Status    : ${status}
 │ 🪄 Prefix    : ${prefix}
 │ 🧪 Node.js   : ${nodeVersion}
 │ 👑 Developer : 𝙵𝙰𝚁𝙷𝙰𝙽..🍅🍒
 ╰─────────────────────╯

✦⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅✦
 𝒮𝓎𝓈𝓉𝑒𝓂 𝒮𝓉𝒶𝓉𝓊𝓈 𝒟𝒶𝓈𝒽𝒷𝑜𝒶𝓇𝒹
✦⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅✦
`;

    message.reply(box);
  }
};
