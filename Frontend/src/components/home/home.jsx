import React, { useState } from 'react'
import './home.css'
import Container from '../Weather_container/container.jsx'
import data from './data.js'
const Home = () => {
    const [Weather,setweather]=useState(data);
    
  return (
    <div className='home'>
       <div className="title">
        <h2 style={{fontStyle:"italic"}}>Weather App</h2>
        </div>  
        <div className='weather_show_container'>
         {
            data.map((w,key)=>{
                return <Container data={w} key={key}/>
            })
         }
        </div>

    </div>
  )
}

export default Home