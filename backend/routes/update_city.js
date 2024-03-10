const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const LIST = mongoose.model("LIST");
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

router.put("/update_city",async (req, res) => {

  const { newcity } = req.body;
  const token=req.headers.authorization;
  const {city}=req.body
   const getted_city= await getweather_data_from_cityname(newcity);
   if(getted_city.city!==newcity){
    return res.json({error:'City not found'})
   }
  if (token === "" || city === "" || newcity === "") {
    return res.status(400).json({ error: "Empty field" });
  }
  const uuid=get_uuid_from_token(token)
  LIST.findOne({ uuid: uuid })
    .then((detail) => {
      if (detail) {
        detail.citylist = detail.citylist.map((value) => {
          if (value === city) {
            return newcity;
          }
          return value;
        });

        detail
          .save()
          .then(() => {
            return res.json({ message: "Updated successfully" });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ error: "Error occurred while saving" });
          });
      } else {
        return res.json({ message: "UUID not found" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: "Error occurred while querying" });
    });
});

module.exports = router;
