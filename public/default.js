const apiai = require('apiai')
const Botkit = require('botkit')
const express = require('express')
const $request = require('request')

const $app = express()

const PORT = process.env.PORT

const app = apiai(process.env.APIAI_API)

const slackToken = process.env.SLACK_API

const controller = Botkit.slackbot({
  debug: false
});

const cont = controller.spawn({
  token: slackToken,
})

cont.startRTM()

const messages = ['direct_message','direct_mention','mention']

function slackResponse($message, message, bot) {

  const request = app.textRequest($message, {
    sessionId: process.env.SESSION_ID
  })

  request.on('response', (response) => {

    if (response.result.action === "getNews") {
      if (response.result.parameters.keyword) {
        const keyword = response.result.parameters.keyword.split(' ').join(';').toLowerCase()

        $request.get({
          url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
          qs: {
            'api-key': process.env.NYT_API,
            'q': keyword,
            'sort': "newest"
          },
        },function(err, res, body) {
          body = JSON.parse(body)

          const attachments = []

          for (let i = 0; i < 3; i++) {
            const headline = body.response.docs[i].headline.main || "Headline not available"
            const linkUrl = body.response.docs[i].web_url || "https://www.nytimes.com"
            const author = body.response.docs[i].byline ? body.response.docs[i].byline.original : "By THE NEW YORK TIMES"
            const webImage = body.response.docs[i].multimedia[i] ? `http://www.nytimes.com/${body.response.docs[i].multimedia[1].url}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/New_York_Times_logo_variation.jpg/300px-New_York_Times_logo_variation.jpg"
            const snippet = body.response.docs[i].snippet

            const article = {
              "title": headline,
              "title_link": linkUrl,
              "author_name": author,
              "image_url": webImage,
              "text": snippet
            }

            attachments.push(article)
          }

          const newsReply = {
            "text": response.result.fulfillment.speech,
            "attachments": attachments
          }
          bot.reply(message, newsReply)
        })
      } else {
        bot.reply(message, response.result.fulfillment.speech)
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

$app.listen(PORT)
