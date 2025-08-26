module.exports = {
  config: {
    name: "hum",
    version: "1.0",
    author: "Farhan",
    countDown: 5,
    role: 0,
    shortDescription: "Send random jokes",
    longDescription: "Bot will reply with a random funny joke",
    category: "fun",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ event, api }) {
    const jokes = [
      "😂 Sir বললো: Exam এ Zero পেলে আমি Fail করবো না…\n👉 Student: তাহলে কে Fail করবে Sir?",
      "🤣 ডাক্তার: রাতে ঘুম হয় না কেন?\n👉 রোগী: Facebook এর প্রেমিকা reply দেয় না 😅",
      "😜 ছেলে: বাবা, বিয়ে করলে কি সুখী হওয়া যায়?\n👉 বাবা: না রে, শুধু বউ হয়!",
      "😂 মেয়ে: আমি কি তোমার স্বপ্নের রানি?\n👉 ছেলে: না, তুমি তো আমার Data MB খরচের রানি!",
      "🤣 Teacher: Present Continuous কী?\n👉 Student: Online ক্লাস! 🤣"
    ];

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    return api.sendMessage(randomJoke, event.threadID, event.messageID);
  }
};
