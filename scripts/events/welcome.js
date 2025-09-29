const axios = require('axios'); // Video stream করার জন্য
const { getTime } = global.utils;

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "2.1",
        author: "BaYjid + ChatGPT",
        category: "events"
    },

    langs: {
        en: {
            session1: "☀ Morning",
            session2: "⛅ Noon",
            session3: "🌆 Afternoon",
            session4: "🌙 Evening",
            welcomeMessage: "✨ Thanks for adding me!\n⚡ Bot Prefix: %1\n🔎 Type %1help to see all commands.",
            multiple1: "🔹 You",
            multiple2: "🔹 You all",
            defaultWelcomeMessage: "🎉 『 WELCOME 』 🎉\n\n💠 Hey {userName}!\n🔹 You just joined 『 {boxName} 』\n⏳ Time for some fun! Have a fantastic {session} 🎊\n\n👤 Added by: {adderName}"
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        if (event.logMessageType !== "log:subscribe") return;

        const { threadID, logMessageData } = event;
        const { addedParticipants } = logMessageData;
        const hours = getTime("HH");
        const prefix = global.utils.getPrefix(threadID);
        const nickNameBot = global.GoatBot.config.nickNameBot;

        // Bot added to group
        if (addedParticipants.some(user => user.userFbId === api.getCurrentUserID())) {
            if (nickNameBot) api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
            return message.send(getLang("welcomeMessage", prefix));
        }

        // Handle multiple joins with timeout
        if (!global.temp.welcomeEvent[threadID]) {
            global.temp.welcomeEvent[threadID] = { joinTimeout: null, dataAddedParticipants: [] };
        }

        global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...addedParticipants);

        clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

        global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {
            const threadData = await threadsData.get(threadID);
            if (threadData.settings.sendWelcomeMessage === false) return;

            const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
            const bannedUsers = threadData.data.banned_ban || [];
            const threadName = threadData.threadName;

            let newMembers = [], mentions = [];
            let isMultiple = dataAddedParticipants.length > 1;

            for (const user of dataAddedParticipants) {
                if (bannedUsers.some(b => b.id === user.userFbId)) continue;
                newMembers.push(user.fullName);
                mentions.push({ tag: user.fullName, id: user.userFbId });
            }

            if (newMembers.length === 0) return;

            // Get adder info
            const adderID = event.author;
            const adderInfo = await api.getUserInfo(adderID);
            const adderName = adderInfo[adderID]?.name || "Someone";
            mentions.push({ tag: adderName, id: adderID });

            // Prepare message
            let welcomeMessage = threadData.data.welcomeMessage || getLang("defaultWelcomeMessage");

            welcomeMessage = welcomeMessage
                .replace(/\{userName\}/g, newMembers.join(", "))
                .replace(/\{boxName\}/g, threadName)
                .replace(/\{multiple\}/g, isMultiple ? getLang("multiple2") : getLang("multiple1"))
                .replace(/\{session\}/g,
                    hours <= 10 ? getLang("session1") :
                    hours <= 12 ? getLang("session2") :
                    hours <= 18 ? getLang("session3") : getLang("session4")
                )
                .replace(/\{adderName\}/g, adderName);

            let form = {
                body: welcomeMessage,
                mentions: mentions
            };

            // ✅ Video attachment (Google Drive)
            try {
                const response = await axios({
                    method: "GET",
                    url: "https://drive.google.com/uc?export=download&id=1G5lLXrM4oh3sA2zFPzBw7GcOP8KdQ9J0",
                    responseType: "stream"
                });

                form.attachment = [response.data];
            } catch (err) {
                console.error("❌ Failed to load welcome video:", err.message);
            }

            await message.send(form);
            delete global.temp.welcomeEvent[threadID];

        }, 1500);
    }
};
