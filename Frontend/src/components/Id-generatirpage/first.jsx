import React, { useEffect, useState } from "react";
import "./first.css";
import Loader from "../loader/loader";
import Container from "../Weather_container/container";
import { Link } from "react-router-dom";

const First = () => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [det, setDet] = useState([]);
  const [tokenRetrieved, setTokenRetrieved] = useState(false);
  const base_url = "http://127.0.0.1:3000";

  async function gettoken(latitude, longitude) {
    try {
      const response = await fetch(`${base_url}/generate_uuid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: {
            longitude: longitude,
            latitude: latitude,
          },
        }),
      });

      const res = await response.json();
      return res.token || null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  async function get_weather_detail() {
    try {
      const response = await fetch(`${base_url}/weather`, {
        method: "GET",
        headers: {
          token: localStorage.getItem("weather_app_token"),
        },
      });
      const detail = await response.json();
      console.log(detail)
      setDet(detail);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching weather details:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem("weather_app_token")) {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const val = await gettoken(latitude, longitude);
            setToken(val);
            localStorage.setItem("weather_app_token", val);
            setTokenRetrieved(true);
          })
        } else {
          console.error("Geolocation is not supported by this browser.");
          setIsLoading(false);
          setDet([]);
        }
      } else {
        setTokenRetrieved(true);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tokenRetrieved) {
      get_weather_detail();
    }
  }, [tokenRetrieved]);

  return (
    <div
      className="first"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#b5cde7",
        minHeight: "100vh",
      }}
    >
      <div
        className="title"
        style={{ marginBottom: "20px", marginTop: "10px" }}
      >
        <h1>Weather App</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="weather_container">
          {isLoading ? (
            <Loader color={"black"} />
          ) : (
             det.map((d, key) => <Container data={d} key={key} />)
          )}
        </div>
      </div>
      <div className="page_shift">
        <Link to="/list">
          <input value="List" type="button" />
        </Link>
      </div>
    </div>
  );
};

export default First;
