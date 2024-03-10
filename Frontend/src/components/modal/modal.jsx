import React from 'react';
import './modal.css'; 
import { IoMdClose } from "react-icons/io";
const Modal = ({ isOpen, closeModal, weatherData }) => {
  if (!isOpen) return null;

  const { city, country, temp, humidity, icon, weather } = weatherData;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-modal" onClick={closeModal}><IoMdClose/></button>
        <h2>{city},{country}</h2>
        <div className="weather-info">
          <div>
            <img src={icon} alt="Weather" />
            <p>{weather}</p>
          </div>
          <div>
            <p>Temperature: {temp} °C</p>
            <p>Humidity: {humidity}%</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Modal;
