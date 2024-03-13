const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require('jsonwebtoken');
const {secret_key} = require('../keys');
const LIST = mongoose.model("LIST");
const { weather_baseurl, weather_key } = require("../keys");
const fetch = require("node-fetch");
async function getweather_data_from_cityname(city) {
  try {
    const response = await fetch(
      `${weather_baseurl}?key=${weather_key}&q=${city}`
    );
    const data = await response.json();
    if (!data.error) {
      const obj = {
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        humidity: data.current.humidity,
        weather: data.current.condition.text,
        icon: data.current.condition.icon,
      };
      return obj;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error fetching weather data:", err);
    return null;
  }
}


function get_uuid_from_token(token) {
  try {
    
      const decoded = jwt.verify(token, secret_key);
      
      return decoded.uuid;
  } catch (error) {
      console.error("Error decoding token:", error);
      return null;
  }
}


router.get("/weather", async (req, res) => {
  const { token } = req.headers;
  
  const uuid=get_uuid_from_token(token)
  if (uuid === "") {
    return res.json({ message: "Data not found" });
  }
  try {
    const details = await LIST.findOne({ uuid: uuid });
    
    if (details) {
      const weather_data = [];
      for (const city of details.citylist) {
        const val = await getweather_data_from_cityname(city);
        weather_data.push(
          val || {
            city: city,
            country: "Not-found",
            temp: "Not-found",
            humidity: "Not-found",
            weather: "Not-found",
            icon: "Not-found",
          }
        );
      }
      return res.json(weather_data);
    } else {
      return res.json({ error: "Not matched" });
    }
  } catch (err) {
    console.error(err);
    res.json({ error: "error occur" });
  }
});

module.exports = router;
