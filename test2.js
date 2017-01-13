const Botkit = require('botkit');
const apiaibotkit = require('api-ai-botkit')

const apiai = apiaibotkit("5dd6932f52584e5080adb53937199db7")

const token = 'xoxb-126272216194-gnngUv5WUWooYNJzuCmJWjex'

const controller = Botkit.slackbot({
  debug: true
});

const messages = ['direct_message','direct_mention','mention']

controller.hears('hello', messages, (bot, message) => {
  apiai.process(message, bot)
})

apiai
  .action('smalltalk.greetings', (message, resp, bot) => {
    var responseText = resp.result.fulfullment.speech
    bot.reply(message, responseText)
  })

  .action('input.unknown', (message, resp, bot) => {
    bot.reply(message, "Sorry, I don't understand")
  })

  const cont = controller.spawn({
    token: token,
  })

  cont.startRTM()
