"use client";
import moment from "moment";
import Image from "next/image";

export default function WeatherApi({ data }) {

  const weather = {
    temp: Math.floor(data.main.temp - 273.15),
    tempLow: Math.floor(data.main.temp_min - 273.15),
    tempHigh: Math.floor(data.main.temp_max - 273.15),
    img: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    nameCity: data.name,
    time: moment().format("LLL"),
  };

  return (
    <div className="weatherContainer">
      <h1 style={{ marginBottom: "10px" }}>{weather.time}</h1>

      <h2 style={{ marginBottom: "10px" }}>
        {weather.nameCity}
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: "10px",
        }}
      >
        <span>🔺{weather.tempHigh}</span>
        <span>🔻{weather.tempLow}</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          fontSize: "30px",
        }}
      >
        <h1 style={{ fontWeight: "900" }}>
          {weather.temp}°
        </h1>

        <Image
          src={weather.img}
          alt="weather icon"
          width={80}
          height={80}
        />
      </div>
    </div>
  );
}