const Botkit = require('botkit');
const apiai = require('botkit-middleware-apiai')({
  token: "5dd6932f52584e5080adb53937199db7"
})

const token = 'xoxb-126272216194-gnngUv5WUWooYNJzuCmJWjex'

const controller = Botkit.slackbot({
  debug: true
});

const cont = controller.spawn({
  token: token,
})

cont.startRTM()

const messages = ['direct_message','direct_mention','mention']

controller.middleware.receive.use(apiai.receive)

controller.hears('hello', messages, apiai.hears, (bot, message) => {
  console.log(message)
  bot.reply(message, 'hey')
})

controller.hears(['hello', 'hey', 'hi'], messages, (bot,message) => {
  bot.reply(message,'Hi!')
});

controller.hears(['bye', 'goodbye', 'later'], messages, (bot,message) => {

})

controller.hears('trump', messages, (bot, message) => {
  bot.reply(message, 'My builder said if I don\'t have anything nice to say, don\'t say anything at all.')
})
