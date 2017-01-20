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

const weatherIcons = {
  "01d": "http://openweathermap.org/img/w/01d.png",
  "02d": "http://openweathermap.org/img/w/02d.png",
  "03d": "http://openweathermap.org/img/w/03d.png",
  "04d": "http://openweathermap.org/img/w/04d.png",
  "09d": "http://openweathermap.org/img/w/09d.png",
  "10d": "http://openweathermap.org/img/w/10d.png",
  "11d": "http://openweathermap.org/img/w/11d.png",
  "13d": "http://openweathermap.org/img/w/13d.png",
  "50d": "http://openweathermap.org/img/w/50d.png",
  "01n": "http://openweathermap.org/img/w/01n.png",
  "02n": "http://openweathermap.org/img/w/02n.png",
  "03n": "http://openweathermap.org/img/w/03n.png",
  "04n": "http://openweathermap.org/img/w/04n.png",
  "09n": "http://openweathermap.org/img/w/09n.png",
  "10n": "http://openweathermap.org/img/w/10n.png",
  "11n": "http://openweathermap.org/img/w/11n.png",
  "13n": "http://openweathermap.org/img/w/13n.png",
  "50n": "http://openweathermap.org/img/w/50n.png"
}

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
    } else if (response.result.action === "getWeather") {
      if (response.result.parameters.city) {
        const city = response.result.parameters.city.split(' ').join('').toLowerCase()
        $request.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.WEATHER_API}`, (req, res, body) => {
          body = JSON.parse(body)

          const temperature = Math.floor(body.main.temp)
          const condition = body.weather[0].description
          const humidity = body.main.humidity
          const icon = body.weather[0].icon

          const attachments = {
            "text": response.result.fulfillment.speech,
            "attachments": [
              {
                "author_name": `${temperature} degrees | humidity ${humidity}% | ${condition}`,
                "author_icon": weatherIcons[icon]
              }
            ]
          }

          bot.reply(message, attachments)
          console.log(body, attachments)
        })
      }else {
        bot.reply(message, response.result.fulfillment.speech)
      }
    }

    else {
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
