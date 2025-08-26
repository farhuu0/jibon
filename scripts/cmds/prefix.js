const fs = require("fs-extra");
const { utils } = global;
const axios = require("axios");
const path = require("path");

module.exports = {
	config: {
		name: "prefix",
		version: "1.6",
		author: "BaYjid",
		countDown: 5,
		role: 0,
		description: "🛠️ 𝐂𝐡𝐚𝐧𝐠𝐞 𝐭𝐡𝐞 𝐛𝐨𝐭 𝐩𝐫𝐞𝐟𝐢𝐱 𝐢𝐧 𝐲𝐨𝐮𝐫 𝐜𝐡𝐚𝐭 𝐛𝐨𝐱 𝐨𝐫 𝐭𝐡𝐞 𝐞𝐧𝐭𝐢𝐫𝐞 𝐬𝐲𝐬𝐭𝐞𝐦 (𝐨𝐧𝐥𝐲 𝐛𝐨𝐭 𝐚𝐝𝐦𝐢𝐧)",
		category: "⚙️ 𝐂𝐨𝐧𝐟𝐢𝐠𝐮𝐫𝐚𝐭𝐢𝐨𝐧",
		guide: {
			en: 
				"━━━━━━━━━━━━━━━━━━━\n"
				+ "📌 {pn} <new prefix>: Change prefix in chat\n"
				+ "📌 {pn} <new prefix> -g: Change prefix system-wide\n"
				+ "📌 {pn} reset: Reset prefix to default\n"
				+ "━━━━━━━━━━━━━━━━━━━"
		}
	},

	langs: {
		en: {
			reset: "✅ Your prefix has been reset to default: %1",
			onlyAdmin: "⚠️ Only admin can change the system prefix!",
			confirmGlobal: "🔄 React to confirm changing the system prefix.",
			confirmThisThread: "🔄 React to confirm changing the prefix in this group.",
			successGlobal: "✅ System prefix changed to: %1",
			successThisThread: "✅ Group prefix changed to: %1",
			myPrefix: 
				"🌍 System Prefix: %1\n"
				+ "💬 Group Prefix: %2\n"
				+ "⏰ Server Time: %3\n"
				+ "💡 Use ➜ %2help to see commands!"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0]) return message.SyntaxError();

		if (args[0] === "reset") {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix,
			setGlobal: args[1] === "-g"
		};

		if (formSet.setGlobal && role < 2) {
			return message.reply(getLang("onlyAdmin"));
		}

		const confirmMessage = formSet.setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread");
		return message.reply(confirmMessage, (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		}

		await threadsData.set(event.threadID, newPrefix, "data.prefix");
		return message.reply(getLang("successThisThread", newPrefix));
	},

	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			const serverTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }); 
			const gifUrl = "https://litter.catbox.moe/hgb5f4cw1m8uaoig.gif";
			const gifPath = path.join(__dirname, "prefix.gif");

			// download gif
			const response = await axios.get(gifUrl, { responseType: "arraybuffer" });
			fs.writeFileSync(gifPath, Buffer.from(response.data, "binary"));

			return message.reply({
				body: getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID), serverTime),
				attachment: fs.createReadStream(gifPath)
			});
		}
	}
};
