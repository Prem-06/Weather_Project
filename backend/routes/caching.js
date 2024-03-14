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
const get_cached_data=async (city)=>{
  console.log(city)
   try{
     const detail=await Cached_list.findOne({'city':city})
    
     if(detail===null){
        const data=await getweather_data_from_cityname(city)
        if(data){
            await Cached_list.insertMany([data]).then((res)=>{
                console.log('saved successfully')
            }).catch((err)=>{
                console.group("error in caching")
            })
        }
     }
     
   }
   catch{
         console.log("error occur while finding city");
         
   }
}

module.exports= get_cached_data;