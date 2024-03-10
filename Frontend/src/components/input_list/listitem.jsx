import React from 'react';
import './listitem.css';
import { useState } from 'react';
import { MdDelete, MdOutlineSystemUpdateAlt } from "react-icons/md";
import Modal from '../modal/modal';
import {toast } from 'react-toastify';

const ListItem = (props) => { 
    const notifyB=(val)=> toast.error(val)
    const notifyA=(val)=> toast.success(val)   
   const {data}=props
   const [modalOpen, setModalOpen] = useState(false);
  const [weatherDetail, setWeatherDetail] = useState(null);
  const {count,setcount}=props
  async function deleteItem(del_city) {
   await fetch('http://127.0.0.1:3000/delete_city',{
    method:"delete",
    headers:{
        "application":"json/content",
         "authorization":localStorage.getItem('weather_app_token'),
         "city":del_city
    },
   }).then((res)=>{
    return res.json();
   }).then((v)=>{
    if(v.error){
        notifyB(v.error)
    }
    else{
        if(count-1>0){
            setcount(count-1);
        }
        else{
            setcount(0)
        }
       
        window.location.reload();
    }
      
   }).catch((err)=>{
    console.log("error")
   })
}

async function update_city(current_city) {
    const val= window.prompt('Enter new city name')
      if(val){
        try {
            const token = localStorage.getItem('weather_app_token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }
    
            const response = await fetch('http://127.0.0.1:3000/update_city', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': String(token),
                },
                body: JSON.stringify({
                    newcity: val,
                    city: current_city,
                })
            });
    
            const data = await response.json();
          
            if(data.error){
                notifyB(v.error)
            }
            else{
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating city:', error);
        }
      }
   
}

async function weather_detail(city){
await fetch('http://127.0.0.1:3000/city_weather',{
    method:'get',
    headers:{
        city:city
    }
}).then((detail)=>{
    return detail.json();
}).then((res)=>{
   setWeatherDetail(res);
   setModalOpen(true);
}).catch((err)=>{
    console.log(err)
})
}

    return (
    
        <div className="listbar">
        
            <div className='cityname' ><p style={{display:'inline'}} onClick={()=>{
                weather_detail(data.city)
                }}>{data.city}</p></div>
            <div className='update-delete-div'>
                <div className='delete'>
                    <MdDelete className='delete-icon' onClick={()=>{deleteItem(data.city)}} />
                </div>
                <div className='update'>
                    <MdOutlineSystemUpdateAlt className='update-icon'  onClick={()=>{update_city(data.city)}}/>
                </div>
            </div>
            <Modal isOpen={modalOpen} closeModal={() => setModalOpen(false)} weatherData={data} />
        </div>
    );
}

export default ListItem;
