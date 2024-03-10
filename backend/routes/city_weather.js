const express=require('express')
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

router.get('/city_weather',async(req,res)=>{
    const city=req.headers.city;
    const data=await getweather_data_from_cityname(city);
    if(data){
        res.json(data);
    }
    else{
        res.json({error:'Cannot get data'})
    }
})

module.exports=router