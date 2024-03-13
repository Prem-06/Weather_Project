import React, { useEffect, useState } from 'react'
import './inputlist.css'
import {Link} from 'react-router-dom'
import Loader from '../loader/loader.jsx'
import Listitem from './listitem.jsx'
import {toast } from 'react-toastify';
const Inputlist = () => {
  const notifyB=(val)=> toast.error(val)
  const notifyA=(val)=> toast.success(val)
  const [count,setcount]=useState(0)
    const [isloading,setisloading]=useState(true)
    const [newcity,setnewcity]=useState("");
    const [detail,setdetail]=useState([])
    async function get_weather_detail() {
      if(!localStorage.getItem('weather_app_token')){
       return 
      }
      try {
          const response = await fetch(`http://127.0.0.1:3000/weather`, {
              method: 'GET',
              headers: {
                  'token': localStorage.getItem('weather_app_token')
              }
          });
          const detail = await response.json();
          setdetail(detail)
          setisloading(false)
      } catch (error) {
          console.error("Error fetching weather details:", error);
      }
  }

  useEffect(()=>{
    get_weather_detail();
    
  },[])

  async function add_item(){
    if(detail.length+1>4){
      notifyB('Only 4 city allowed')
    }
    else{
     
      await fetch('http://127.0.0.1:3000/addcity',{
        method:'post',
        headers: {
          'Content-Type': 'application/json'
      },
        body:JSON.stringify({
          city:newcity,
          token:localStorage.getItem('weather_app_token')
        })
      }).then((result)=>{
  return result.json();
      }).then((res)=>{
        if(res.error){
          notifyB(res.error)
        }
        else{
          window.location.reload();
          setnewcity("")
          setcount(count+1);
        }
        
        
      }).catch((err)=>{
        console.log(err)
      })
    }
   
  }

  
  return (
    <div className='inputlist' style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",backgroundColor:"#b5cde7"}}>
       <div style={{marginBottom:"20px",marginTop:"10px"}}><h1>Weather App</h1></div>
        
          <div className="titlebar">
            <div className='citytag'>City Name</div>
            <div className='update-delete-tag'>
            <div className='delete-tag'>Delete</div>
            <div className='update-tag'>Update</div>
            </div>  
          </div>
          { 
          isloading?(<Loader color="black" />):(
            detail.map((m,key)=>{
              return <Listitem data={m} key={key} setcount={setcount} count={count}/>
            })
          )}

         <div className='Add-button'>
            <input type="text" value={newcity} onChange={(e)=>{ setnewcity(e.target.value)}} />
            <input type="button" value="ADD" onClick={add_item} />
         </div>
          
         <div className="page_shift">
<Link to="/"><input value="View Weather" type='button'/></Link>
</div>
    </div>
  )
}

export default Inputlist