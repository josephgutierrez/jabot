const express = require('express')
const Botkit = require('botkit')
const apiai = require('apiai')
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
    if (response.result.action === "getWeather") {
      const city = response.result.parameters.city.split(' ').join('').toLowerCase()
      console.log(city)
      $request.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1279419e8e4979829e620ff92fb84c86`, (req, res, body) => {
        console.log(body)
      })
    } else if (response.result.action === "getNews") {
        const keyword = response.result.parameters.keyword
        console.log(keyword)
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



// openweather address for weather by city
// http://api.openweathermap.org/data/2.5/weather?q=sacramento&appid=1279419e8e4979829e620ff92fb84c86

// openweather object:
// {"coord":{"lon":-121.49,"lat":38.58},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"base":"stations","main":{"temp":281.78,"pressure":1022,"humidity":66,"temp_min":278.15,"temp_max":284.15},"visibility":16093,"wind":{"speed":1.5},"clouds":{"all":20},"dt":1484600280,"sys":{"type":1,"id":464,"message":0.2117,"country":"US","sunrise":1484580078,"sunset":1484615483},"id":5389489,"name":"Sacramento","cod":200}
