import React from 'react'
import './container.css'
import links from '../../../public/picture/image_export'
const Container = (prop) => {
    const {data}=prop;
  
    
  return (
    <div className='container'>
        <div className='image_div'>
           <img src={data.icon} alt="err" />
        </div>
        <div className='weather_details'>
          <div className='detail-div'>{data.city},{data.country}</div>
          <div className='detail-div'>{data.weather}</div>
          <div style={{display:"flex",flexDirection:"row",margin:"0px"}}>
            <div className='detail-div' style={{marginRight:"3px"}}>Temp: {data.temp}</div>
            <div className='detail-div' style={{marginLeft:"3px"}}>Humidity:{data.humidity}%</div>
          </div>
        </div>
    </div>
  )
}

export default Container