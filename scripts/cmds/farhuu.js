module.exports.config = {
  name: "farhu",
  version: 0.2,
  author: "BaYjid",
  category: "npx",
  description: "xass bot",
  countdown: 5,
  role: 0,
};

module.exports.onStart = ({}) => {};

module.exports.onChat = async ({ api, event, args }) => {
  try {
    const msg = event.body.toLowerCase();

    if (msg === "xoss" || msg === "farhuu") {
      api.sendMessage(
        {
          body: 
`┏━━━✦✗✦━━━┓
 𝐅𝐚𝐫𝐇𝐚𝐧 𝐁𝐎𝐓 𝐇𝐞𝐑𝐞  
┗━━━✦✗✦━━━┛
> Nickname: - 𝐅𝐚𝐫𝐇𝐮𝐮•-🦈🕸️🫀
> Owner: -𝐗𝐨𝐬𝐬 - 𝐅𝐚𝐫𝐇𝐚𝐧•-🕷️🕸️🫀 (Etx)
> 𝐅𝐀𝐑𝐇𝐀𝐍 𝐁𝐎𝐓__/:;)🤍
🦈🫀`,
          attachment: await global.utils.getStreamFromURL("https://drive.google.com/uc?export=download&id=1_5R93Fri9FaawgqvJvPw70Sy6JsIv1S2"),
        },
        event.threadID,
        event.messageID
      );
    }
  } catch (err) {
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};
