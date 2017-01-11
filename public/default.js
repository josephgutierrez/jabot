const Botkit = require('botkit')
const token = 'xoxb-126272216194-gnngUv5WUWooYNJzuCmJWjex';
const controller = Botkit.slackbot({
  debug: false
})

const bot = controller.spawn({
  token: token,
}).startRTM

controller.hears('hello', 'hi', 'hey', ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, 'Hello.');
});

controller.hears('bye', 'goodbye' ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, 'See you later!');
})

controller.on('message_received', (bot, message) => {
  bot.replyPublic(message, 'Everyone can see the results of this slack command');
});
