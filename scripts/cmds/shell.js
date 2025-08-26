const { exec } = require('child_process');

module.exports = {
  config: {
    name: "shell",
    version: "1.0",
    author: "T A N J I L 🎀",
    countDown: 5,
    role: 0,
    shortDescription: "Execute shell commands",
    longDescription: "",
    category: "shell",
    guide: {
      vi: "{p}{n} <command>",
      en: "{p}{n} <command>"
    }
  },

  onStart: async function ({ args, message, event }) {
    const allowedUID = "100080736881604";
    const senderID = event.senderID;

    if (senderID !== allowedUID) {
      return message.reply("⚠️ Madarchod Tui Amar Boss FarHan na ⛔ Only my creator FarHan can use this command.");
    }

    const command = args.join(" ");

    if (!command) {
      return message.reply("⚠️ Please provide a command to execute.");
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error}`);
        return message.reply(`❌ An error occurred: ${error.message}`);
      }

      if (stderr) {
        console.error(`⚠️ STDERR: ${stderr}`);
        return message.reply(`⚠️ STDERR:\n${stderr}`);
      }

      console.log(`✅ STDOUT:\n${stdout}`);
      message.reply(`✅ Command executed:\n${stdout}`);
    });
  }
};
