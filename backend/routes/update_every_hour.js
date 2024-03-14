const express=require('express')
const mongoose=require('mongoose')
const Cached_list=mongoose.model("CACHEDLIST");
const router=express.Router();
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

  async function update_data() {
    try {
        const data = await Cached_list.find();
        const citylist = data.map(d => d.city);
        
        for (const element of citylist) {
            const detail = await getweather_data_from_cityname(element);
            if (detail) {
                await Cached_list.findOneAndUpdate({ city: element }, detail);
                console.log("Updated data for", element);
            }
        }
    } catch (err) {
        console.error("Error occurred while updating data:", err);
    }
}

  setInterval(update_data,60000)