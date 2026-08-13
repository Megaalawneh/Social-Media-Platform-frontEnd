import "../styles/mainPageStyle.css";
import WeatherApi from "./weatherPage";
export default async function Wather() {
  async function updateWeather() {
    try {
      const response = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?lat=32.551445&lon=35.851479&appid=837a0b65ce9fd7188989b764bc47616b",
        {
          next: {
            revalidate:59
          },
        },
      );
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  }
  const data = await updateWeather();
  return (
    <>
      <WeatherApi data={data} />
    </>
  );
}
