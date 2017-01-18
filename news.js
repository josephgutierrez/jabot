const apiai = require('apiai')
const Botkit = require('botkit')
const express = require('express')
const $request = require('request')

const $app = express()

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
                'q': keyword
              },
            },function(err, res, body) {
                body = JSON.parse(body)
                const headline = body.response.docs[0].headline.main
                const linkUrl = body.response.docs[0].web_url
                const author = body.response.docs[0].byline.original
                const webImage = "http://www.nytimes.com/" + body.response.docs[0].multimedia[1].url
                const snippet = body.response.docs[0].snippet

                const newsReply = {
                  "text": response.result.fulfillment.speech,
                  "attachments": [
                    {
                        "title": headline,
                	      "title_link": linkUrl,
                        "author_name": author,
                        "image_url": webImage
                    },
                    {
                        "text": snippet
                    }
                  ]
                }
                bot.reply(message, newsReply)
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
