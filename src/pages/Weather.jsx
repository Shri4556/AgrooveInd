import React, { useState, useEffect } from 'react';
import { fetchCityWeather } from '../services/api';
import { Search, MapPin, Wind, Droplets, ThermometerSun, AlertCircle, Sunrise, Sunset, Eye, Leaf, CloudRain, Sun, Cloud, ArrowUp, ArrowDown, CloudSun } from 'lucide-react';

const Weather = () => {
  const defaultUserCity = localStorage.getItem('profileCity') || localStorage.getItem('userCity') || 'Kalyan'; 
  
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultUserCity) loadWeather(defaultUserCity);
  }, [defaultUserCity]);

  const loadWeather = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError('');
    
    const data = await fetchCityWeather(cityName);
    if (data) {
      setWeatherData(data);
      setCity(''); 
    } else {
      setError('City not found. Please try again later or check again.');
      setWeatherData(null);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() !== '') loadWeather(city);
  };

  const formatTime = (timestamp, timezoneOffset) => {
    const localTime = new Date((timestamp + timezoneOffset) * 1000);
    return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  const getWeatherIcon = (code) => {
    if (code === 0 || code === 1) return <Sun size={22} color="#f5a623" />;
    if (code === 2 || code === 3) return <CloudSun size={22} color="#78909c" />;
    if (code >= 51 && code <= 67) return <CloudRain size={22} color="#4a90e2" />;
    return <Cloud size={22} color="#9e9e9e" />;
  };

  const getAQIStatus = (aqi) => {
    const statuses = { 1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Very Poor' };
    return statuses[aqi] || 'Unknown';
  };

  const getSoilStatus = (moisture) => {
    if (moisture > 0.3) return 'Optimal';
    if (moisture > 0.15) return 'Moderate';
    return 'Dry';
  };

  return (
    <div style={{ padding: '30px', minHeight: '100vh', backgroundColor: '#edf7ee', fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Leaf size={32} color="#1b5e20" fill="#4caf50" />
        <div>
          <h2 style={{ color: '#002d18', fontSize: '2rem', margin: '0 0 4px 0', fontWeight: '800' }}>Agro-Weather Forecast</h2>
          <p style={{ color: '#4caf50', margin: 0, fontSize: '1rem', fontWeight: '500' }}>Real-time weather insights for your registered farm location.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px', background: '#fff', padding: '10px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <MapPin size={20} color="#2e7d32" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text" value={city} onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city or village name..."
                style={{ width: '100%', padding: '12px 16px 12px 45px', border: '1px solid #e0e0e0', borderRadius: '12px', fontSize: '1rem', outline: 'none' }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '0 28px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
              <Search size={18} /> Search
            </button>
          </form>

          {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '12px', fontWeight: 'bold', display:'flex', gap:'8px' }}><AlertCircle size={20}/> {error}</div>}

          {weatherData && !loading && (
            <div style={{ background: '#ffffff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              
              <div style={{ 
                height: '150px', 
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80")', 
                backgroundSize: 'cover', backgroundPosition: 'center', padding: '24px', color: 'white', position: 'relative'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                  <MapPin size={24} /> {weatherData.current.name}, {weatherData.current.sys.country}
                </h3>
                <p style={{ margin: '4px 0 0 32px', fontSize: '0.9rem', opacity: 0.95, textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                  Lat: {weatherData.current.coord.lat.toFixed(2)} | Lon: {weatherData.current.coord.lon.toFixed(2)}
                </p>
                {/* Smooth Wavy White Curve matching Image */}
                <svg viewBox="0 0 1440 320" style={{ position: 'absolute', bottom: -1, left: 0, width: '100%' }}>
                  <path fill="#ffffff" fillOpacity="1" d="M0,160L80,176C160,192,320,224,480,213.3C640,203,800,149,960,138.7C1120,128,1280,160,1360,176L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
              </div>

              <div style={{ padding: '10px 24px 24px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`} alt="Icon" style={{ width: '90px' }} />
                    <div>
                      <div style={{ fontSize: '4.5rem', fontWeight: '800', color: '#002d18', lineHeight: '1' }}>{Math.round(weatherData.current.main.temp)}<span style={{ fontSize: '2rem', verticalAlign: 'top' }}>°C</span></div>
                      <div style={{ color: '#1b5e20', fontWeight: '700', textTransform: 'capitalize', marginTop: '4px', fontSize: '1.1rem' }}>{weatherData.current.weather[0].description}</div>
                    </div>
                  </div>
                  <div style={{ color: '#444', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}><ThermometerSun size={16} color="#2e7d32"/> Feels like: <strong>{Math.round(weatherData.current.main.feels_like)}°C</strong></div>
                    <div style={{ display: 'flex', gap: '6px' }}><ArrowUp size={16} color="#2e7d32"/> Min: <strong>{Math.round(weatherData.current.main.temp_min)}°C</strong></div>
                    <div style={{ display: 'flex', gap: '6px' }}><ArrowDown size={16} color="#2e7d32"/> Max: <strong>{Math.round(weatherData.current.main.temp_max)}°C</strong></div>
                  </div>
                </div>

                {/* 3 Metric Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ background: '#f4f8ff', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Droplets size={22} color="#1976d2" />
                    <div><p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Humidity</p><p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.05rem', color: '#002d18' }}>{weatherData.current.main.humidity}%</p></div>
                  </div>
                  <div style={{ background: '#f4fbf5', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Wind size={22} color="#2e7d32" />
                    <div><p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Wind</p><p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.05rem', color: '#002d18' }}>{weatherData.current.wind.speed} m/s</p></div>
                  </div>
                  <div style={{ background: '#fff9f0', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ThermometerSun size={22} color="#f57c00" />
                    <div><p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Pressure</p><p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.05rem', color: '#002d18' }}>{weatherData.current.main.pressure} hPa</p></div>
                  </div>
                </div>

                {/* Dynamic 7-Day Forecast Row */}
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                  <div style={{ background: '#eaf5eb', padding: '10px', borderRadius: '14px', textAlign: 'center', minWidth: '85px', border: '1px solid #c8e6c9' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#1b5e20', fontSize: '0.9rem' }}>Today</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#2e7d32' }}>{weatherData.current.name}</p>
                  </div>
                  {weatherData.forecast.time.slice(1, 7).map((dateString, index) => {
                    const dateObj = new Date(dateString);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const dateNum = dateObj.getDate();
                    return (
                      <div key={index} style={{ textAlign: 'center', minWidth: '65px', display: 'flex', flexDirection: 'column', gap: '4px', background: '#fafafa', padding: '8px', borderRadius: '12px' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>{dateNum} {dayName}</p>
                        <div style={{ margin: '0 auto' }}>{getWeatherIcon(weatherData.forecast.weather_code[index + 1])}</div>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold', color: '#002d18' }}>
                          {Math.round(weatherData.forecast.temperature_2m_max[index + 1])}° <span style={{ color: '#999', fontWeight: 'normal' }}>{Math.round(weatherData.forecast.temperature_2m_min[index + 1])}°</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        {weatherData && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#002d18', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Leaf size={22} color="#2e7d32"/> Expert Crop Advisory</h4>
              <div style={{ background: '#f4fbf5', padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px' }}>
                <Leaf size={22} color="#4caf50" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, color: '#2e7d32', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {weatherData.current.main.temp > 35 ? "High temperature! Ensure optimal irrigation. " : ""}
                  {weatherData.forecast.weather_code[0] >= 51 ? "Rain forecasted. Postpone fertilizer application to prevent runoff." : "Weather conditions are optimal for general farm activities, sowing, and routine field inspections."}
                </p>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 20px 0', color: '#002d18', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Leaf size={22} color="#2e7d32"/> Environmental Factors</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: '#fff3e0', padding: '12px', borderRadius: '50%' }}><Sunrise size={22} color="#f57c00" /></div>
                  <div><p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Sunrise</p><p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.05rem', color: '#002d18' }}>{formatTime(weatherData.current.sys.sunrise, weatherData.current.timezone)}</p></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '50%' }}><Sunset size={22} color="#1976d2" /></div>
                  <div><p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Sunset</p><p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.05rem', color: '#002d18' }}>{formatTime(weatherData.current.sys.sunset, weatherData.current.timezone)}</p></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', gridColumn: '1 / -1', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                  <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '50%' }}><Eye size={22} color="#2e7d32" /></div>
                  <div><p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Visibility</p><p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.05rem', color: '#002d18' }}>{(weatherData.current.visibility / 1000).toFixed(1)} km</p></div>
                </div>
              </div>
            </div>

            {/* AQI, UV, Soil Moisture Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: '#fff', padding: '20px 16px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
                <Wind size={24} color="#4caf50" style={{ margin: '0 auto 10px' }} />
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Air Quality</p>
                <p style={{ margin: '4px 0 10px 0', fontWeight: 'bold', color: '#1b5e20', fontSize: '1rem' }}>{getAQIStatus(weatherData.aqi)}</p>
                <div style={{ height: '4px', background: '#e0e0e0', borderRadius: '2px', margin: '0 8px' }}><div style={{ width: `${(6 - weatherData.aqi) * 20}%`, height: '100%', background: '#4caf50', borderRadius: '2px' }}></div></div>
              </div>
              <div style={{ background: '#fff', padding: '20px 16px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
                <Sun size={24} color="#f5a623" style={{ margin: '0 auto 10px' }} />
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>UV Index</p>
                <p style={{ margin: '4px 0 10px 0', fontWeight: 'bold', color: '#f5a623', fontSize: '1rem' }}>{weatherData.uvIndex} Max</p>
              </div>
              <div style={{ background: '#fff', padding: '20px 16px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
                <Droplets size={24} color="#2e7d32" style={{ margin: '0 auto 10px' }} />
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Soil Moisture</p>
                <p style={{ margin: '4px 0 10px 0', fontWeight: 'bold', color: '#2e7d32', fontSize: '1rem' }}>{getSoilStatus(weatherData.soilMoisture)}</p>
                <div style={{ height: '4px', background: '#e0e0e0', borderRadius: '2px', margin: '0 8px' }}><div style={{ width: `${Math.min(weatherData.soilMoisture * 200, 100)}%`, height: '100%', background: '#2e7d32', borderRadius: '2px' }}></div></div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;