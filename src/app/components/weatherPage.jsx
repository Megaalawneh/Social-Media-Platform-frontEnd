"use client";
import Image from "next/image";
import "../styles/mainPageStyle.css";
import { useContext, useEffect, useState } from "react";
import { AuthGuardContext } from "../Context/AuthGuardContext";

export default function WeatherApi() {
  const { currentUser } = useContext(AuthGuardContext);
  const [weatherResult, setWeatherResult] = useState(null);
  const [weatherErrorResult, setWeatherErrorResult] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const city = currentUser?.userCity;
  const hasCoordinates =
    Number.isFinite(city?.lat) && Number.isFinite(city?.lon);
  const locationKey = hasCoordinates ? `${city.lat},${city.lon}` : null;
  const weatherData =
    weatherResult?.locationKey === locationKey ? weatherResult.data : null;
  const weatherError =
    weatherErrorResult?.locationKey === locationKey
      ? weatherErrorResult.message
      : "";

  useEffect(() => {
    if (!hasCoordinates) return undefined;

    const controller = new AbortController();
    const requestLocationKey = `${city.lat},${city.lon}`;
    async function loadWeather() {
      try {
        const params = new URLSearchParams({
          lat: String(city.lat),
          lon: String(city.lon),
        });
        const response = await fetch(`/api/weather?${params}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Weather service is unavailable.");
        }
        setWeatherResult({ locationKey: requestLocationKey, data });
        setWeatherErrorResult({ locationKey: requestLocationKey, message: "" });
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Failed to fetch weather data:", error);
        setWeatherErrorResult({
          locationKey: requestLocationKey,
          message: error.message || "Weather is currently unavailable.",
        });
      }
    }

    loadWeather();
    return () => controller.abort();
  }, [city?.lat, city?.lon, hasCoordinates]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const timezoneOffset = (weatherData?.timezone || 0) * 1000;
  const cityTime = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(currentTime.getTime() + timezoneOffset));
  const temperature = weatherData?.main
    ? Math.floor(weatherData.main.temp - 273.15)
    : null;
  const temperatureLow = weatherData?.main
    ? Math.floor(weatherData.main.temp_min - 273.15)
    : null;
  const temperatureHigh = weatherData?.main
    ? Math.floor(weatherData.main.temp_max - 273.15)
    : null;
  const icon = weatherData?.weather?.[0]?.icon;

  return (
    <div className="weatherContainer">
      <h1 style={{ marginBottom: "10px" }}>
        {city?.name ? cityTime : "Set your city in profile settings"}
      </h1>

      <h2 style={{ marginBottom: "10px" }}>
        {city?.name || ""}
      </h2>

      {weatherData && temperatureLow !== null && temperatureHigh !== null && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "10px",
          }}
        >
          <span>🔺{temperatureHigh}°C</span>
          <span>🔻{temperatureLow}°C</span>
        </div>
      )}

      {weatherData && temperature !== null && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            fontSize: "30px",
          }}
        >
          <h1 style={{ fontWeight: "900" }}>{temperature}°C</h1>

          {icon && (
            <Image
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt="weather icon"
              width={80}
              height={80}
            />
          )}
        </div>
      )}
      {weatherError && (
        <p role="alert">{weatherError}</p>
      )}
    </div>
  );
}
