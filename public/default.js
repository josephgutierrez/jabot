const Botkit = require('botkit');

const slackToken = 'xoxb-126272216194-gnngUv5WUWooYNJzuCmJWjex'

const controller = Botkit.slackbot({
  debug: true
});

const cont = controller.spawn({
  token: slackToken,
})

cont.startRTM()

const messages = ['direct_message','direct_mention','mention']

controller.hears(['hello', 'hey', 'hi'], messages, (bot,message) => {
  bot.reply(message,'Hi!')
});

controller.hears(['bye', 'goodbye', 'later'], messages, (bot,message) => {
  bot.reply(message, 'See you later!')
})

controller.hears('trump', messages, (bot, message) => {
  bot.reply(message, 'My builder said if I don\'t have anything nice to say, don\'t say anything at all.')
})
