module.exports = {
	config: {
		name: "goiadmin",
		author: "𝗔𝗺𝗶𝗻𝘂𝗹 𝗦𝗼𝗿𝗱𝗮𝗿 | Edited by Farhan",
		role: 0,
		shortDescription: " ",
		longDescription: "",
		category: "BOT",
		guide: "{pn}"
	},

	onChat: function({ api, event }) {
		if (event.senderID !== "100080736881604,61578270134835") {
			var aid = ["100080736881604,61578270134835"];
			for (const id of aid) {
				if (Object.keys(event.mentions) == id) {
					var msg = [
						"⚠️ বস এখন খুব ব্যস্ত, পরে মিনশন দিয়েন!",
						"😼 ❁𝐅𝐀𝐑𝐇𝐀𝐍𖣘 বস এখন ফ্রি না, আমাকে বলুন কী দরকার?",
						"🙄 এতবার মিনশন দিয়া লাভ নাই, ইনবক্স করুন।",
						"😒 মিনশন না দিয়ে এক গ্লাস পানি খেয়ে আসেন!",
						"🤫 ❁𝐅𝐀𝐑𝐇𝐀𝐍𖣘 বস এখন গভীর চিন্তায়, দয়া করে বিরক্ত করবেন না!",
						"📵 ভাইরে ভাই, মিনশন দিলে নোটিফিকেশন ভাইঙ্গা পড়ে!",
						"😂 ❁𝐅𝐀𝐑𝐇𝐀𝐍𖣘 বস তো তোর গার্ডিয়ান না, ক্যান এত চিন্তা করস?",
						"🥱 বস তো ঘুমায়া পড়ছে, এখন ডাক দিয়া লাভ নাই!",
						"😤 এতবার মিনশন দিয়া লাভ নাই, উনি তো বিজি ইন লাভ!",
						"🕵️‍♂️ ❁𝐅𝐀𝐑𝐇𝐀𝐍𖣘 বস এর খোঁজ রাখার জন্য তোমাকে পুরস্কার দেওয়া উচিত!"
					];
					
					return api.sendMessage(
						{ body: msg[Math.floor(Math.random() * msg.length)] },
						event.threadID,
						event.messageID
					);
				}
			}
		}
	},

	onStart: async function({}) {}
};
