const express = require('express')
const request = require('request')

const app = express()

request.get('http://api.openweathermap.org/data/2.5/weather?q=pasadena&appid=1279419e8e4979829e620ff92fb84c86', (req, res, body) => {
  console.log(body)
})

app.listen(3000)
