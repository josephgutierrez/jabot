request.on('response', (response) => {
  if (response.result.action === "getWeather") {
    const city = response.result.parameters.city.split(' ').join('').toLowerCase()
    console.log(city)
    if (!city) {
      bot.reply(message, response.result.fulfillment.speech)
    } else {
      $request.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1279419e8e4979829e620ff92fb84c86`, (req, res, body) => {
        console.log(body)
        // console.log(body.weather[0].id)
      })
    }


    // const temperature = body.weather.main.temp
    // const humidity = body.weather.main.humidity
    // const conditions = body.weather[0].id

    // openweather address for weather by city
    // http://api.openweathermap.org/data/2.5/weather?q=sacramento&appid=1279419e8e4979829e620ff92fb84c86

    // openweather object:
    // {
    // "coord":{
    //   "lon":-118.24,
    //   "lat":34.05},
    // "weather":[
    //   {
    //     "id":721,
    //     "main":"Haze",
    //     "description":"haze",
    //     "icon":"50d"}],
    //   "base":"stations",
    //   "main":{
    //     "temp":53.15,
    //     "pressure":1020,
    //     "humidity":58,
    //     "temp_min":46.4,
    //     "temp_max":55.4},
    //     "visibility":16093,
    //     "wind":{
    //       "speed":4.7,
    //       "deg":110},
    //       "clouds":{"all":1},
    //       "dt":1484672280,
    //       "sys":{
    //         "type":1,
    //         "id":396,
    //         "message":0.2114,
    //         "country":"US",
    //         "sunrise":1484665045,
    //         "sunset":1484701787},
    //         "id":5368361,
    //         "name":"Los Angeles",
    //         "cod":200}
