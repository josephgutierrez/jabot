const Botkit = require('botkit')
const apiai = require('apiai')

const app = apiai('5dd6932f52584e5080adb53937199db7')

const slackToken = 'xoxb-126272216194-gnngUv5WUWooYNJzuCmJWjex'

const controller = Botkit.slackbot({
  debug: true
});

const cont = controller.spawn({
  token: slackToken,
})

cont.startRTM()

const messages = ['direct_message','direct_mention','mention']

function slackResponse(message) {

  const request = app.textRequest(message, {
    sessionId: '3849666a-cb81-4fbd-84a0-365210c5ff0d'
  })

  request.on('response', (response) => {
    console.log(response.result.fulfillment.speech)
  })

  request.on('error', (error) => {
    console.log(error)
  })

  request.end()
}

controller.on('direct_message', (bot, message) => {
  slackResponse(message["text"])
})



// controller.hears(['hello', 'hey', 'hi'], messages, (bot,message) => {
//   bot.reply(message,'Hi!')
// });
//
// controller.hears(['bye', 'goodbye', 'later'], messages, (bot,message) => {
//   bot.reply(message, 'See you later!')
// })
//
// controller.hears('trump', messages, (bot, message) => {
//   bot.reply(message, 'My builder said if I don\'t have anything nice to say, don\'t say anything at all.')
// })
//
//

// { id: '895e27fc-50b7-4e98-88d0-4488e10c454c',
//   timestamp: '2017-01-12T22:02:48.035Z',
//   result:
//    { source: 'agent',
//      resolvedQuery: 'will it snow tomorrow in san francisco?',
//      action: '',
//      actionIncomplete: false,
//      parameters:
//       { city: 'San Francisco',
//         date: '2017-01-13',
//         forecast: 'snow',
//         'geo-city': '' },
//      contexts: [],
//      metadata:
//       { intentId: 'e3301e8b-3f58-4f21-97fc-251f76db69f9',
//         webhookUsed: 'false',
//         webhookForSlotFillingUsed: 'false',
//         intentName: 'GetWeather' },
//      fulfillment: { speech: 'It will be', messages: [Object] },
//      score: 1 },
//   status: { code: 200, errorType: 'success' },
//   sessionId: '3849666a-cb81-4fbd-84a0-365210c5ff0d' }
