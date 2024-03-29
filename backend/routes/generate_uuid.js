const mongoose=require('mongoose');
const express=require('express')
const router=express.Router()
const LIST=mongoose.model('LIST')
const jwt = require('jsonwebtoken');
const {secret_key} = require('../keys');
const { v4: uuidv4 } = require('uuid');
function generate_uuid(){
    const uuid = uuidv4();
    return uuid;
}

async function getlocation(latitude,longitude){
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        const city = data;
      return city;
    } catch (error) {
        console.error("Error fetching city:");
        return null
    }
}

function generate_token(uuid){
    const payload = {
        uuid: uuid,
    }
    const token = jwt.sign(payload, secret_key, { expiresIn: '3000hr' });
    
    return token;
}


router.post('/generate_uuid',async (req,res)=>{

    const latitude=req.body.location.latitude;
    const longitude=req.body.location.longitude;
    const city_info=await getlocation(latitude,longitude)
    const city=city_info.address.city
    await save_data(city);
    const id=String(await generate_uuid());
    const token=await generate_token(id);
   
    if(!token){
        return res.status(404).json({error:"server error"})
    }
    else{
        const data={
            uuid:id,
            citylist:[city]
        }
       const response_obj={
        token:token,
        city:city
       }
      
        LIST.insertMany([data]).then(()=>{
            return res.status(200).json(response_obj)
        }).catch(()=>{
            return res.status(404).json({error:"server error"})
        })
        
    }
    
})

module.exports=router