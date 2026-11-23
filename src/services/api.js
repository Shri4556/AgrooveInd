export const fetchCityWeather = async (city) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  try {
    // 1. Current Weather (Temp, Wind, Pressure, Lat/Lon)
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`
    );
    if (!currentRes.ok) throw new Error("City not found");
    const currentData = await currentRes.json();
    const { lat, lon } = currentData.coord;

    // 2. Air Pollution (Real AQI)
    const aqiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const aqiData = await aqiRes.json();

    // 3. Open-Meteo (Real 7-Day Forecast, UV Index, Soil Moisture)
    const meteoRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&hourly=soil_moisture_0_to_7cm&timezone=auto`
    );
    const meteoData = await meteoRes.json();

    return {
      current: currentData,
      aqi: aqiData.list[0].main.aqi, // 1 to 5 scale
      forecast: meteoData.daily, // Exact dates, min/max temps
      soilMoisture: meteoData.hourly.soil_moisture_0_to_7cm[0] || 0.3, // Current soil moisture
      uvIndex: meteoData.daily.uv_index_max[0] || 0 // Today's UV Index
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};