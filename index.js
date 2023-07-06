const express = require("express");
const http = require("http");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  const apiKey = process.env.API_KEY;
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const request = http.get(url, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const weatherData = JSON.parse(data);
      const { main, weather, name } = weatherData;
      const { temp, humidity } = main;
      const { description } = weather[0];

      res.status(200).json({
        city: name,
        description,
        temp,
        humidity,
      });
    });
  });

  request.on("error", (error) => {
    res.status(500).json({ error: error.message });
  });
});

app.listen(port, () => {
  console.log(`Weather app listening at http://localhost:${port}`);
});
