const apiai = require('apiai')
const bodyParser = require('body-parser')
const Botkit = require('botkit')
const express = require('express')
const $request = require('request')

const $app = express()

const jsonParser = bodyParser.json()

$app.use(jsonParser)

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

function slackResponse($message, message, bot) {

  const request = app.textRequest($message, {
    sessionId: '3849666a-cb81-4fbd-84a0-365210c5ff0d'
  })

  request.on('response', (response) => {
    if (response.result.action === "getNews") {
        const keyword = response.result.parameters.keyword.split(' ').join(';').toLowerCase()
        console.log(keyword)
          if (!keyword) {
            bot.reply(message, response.result.fulfillment.speech)
          }
          else {
            $request.get({
              url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
              qs: {
                'api-key': '68892a116d9e4c3ebd8429e3ce9c196f',
                'fq': keyword
              },
            },function(err, response, body) {
              body = JSON.parse(body)
              console.log(body)
            })
          }
    } else {
      bot.reply(message, response.result.fulfillment.speech)
    }
  })

  request.on('error', (error) => {
    console.log(error)
  })

  request.end()
}

controller.on(messages, (bot, message) => {
  slackResponse(message.text, message, bot)
})

$app.listen(3000)
