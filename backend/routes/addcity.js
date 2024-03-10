const express = require("express");
const mongoose = require("mongoose");
const LIST = mongoose.model("LIST");
const router = express.Router();
const jwt = require('jsonwebtoken');
const {secret_key} = require('../keys');

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


router.post("/addcity", (req, res) => {
  const { token, city } = req.body;
 
const uuid=get_uuid_from_token(token)
  if (uuid === "" || city === "") {
    return res.json({ error: "empty field" });
  }
  
  LIST.findOne({ uuid: uuid })
    .then(async (detail) => {
      if (detail) {
        if (!detail.citylist.includes(city)) {
          const getted_city= await getweather_data_from_cityname(city);
          console.log(getted_city)
          if(getted_city.city!==city){
        return res.json(({error:"No data found"}))
          }
          detail.citylist.push(city);
          detail.save();
          res.json({ message: "City Added" });
        } else {
          res.json({ message: "city already exist" });
        }
      } else {
        const newDetail = new LIST({ uuid: uuid, citylist: [city] });
        newDetail.save();
        res.json({ message: "City Added" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: "error occur" });
    });
});

module.exports = router;
