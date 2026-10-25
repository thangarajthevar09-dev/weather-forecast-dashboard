
import { useState } from "react";
import "./App.css";

const DEMO_WEATHER = {
  London: {
    temperature: 18,
    condition: "Cloudy",
    humidity: 72,
    wind: 14,
    icon: "☁️",
  },
  Mumbai: {
    temperature: 31,
    condition: "Partly cloudy",
    humidity: 68,
    wind: 12,
    icon: "🌤️",
  },
  Delhi: {
    temperature: 29,
    condition: "Sunny",
    humidity: 45,
    wind: 9,
    icon: "☀️",
  },
};

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function searchWeather(event) {
    event.preventDefault();

    const searchCity = city.trim();

    if (!searchCity) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

      if (!apiKey) {
        const match = Object.keys(DEMO_WEATHER).find(
          (name) => name.toLowerCase() === searchCity.toLowerCase(),
        );

        if (!match) {
          throw new Error(
            "City not found. Try London, Mumbai, or Delhi.",
          );
        }

        setWeather({
          city: match,
          ...DEMO_WEATHER[match],
        });
        return;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchCity)}&appid=${apiKey}&units=metric`,
      );

      if (!response.ok) {
        throw new Error("City not found. Please check the name and try again.");
      }

      const data = await response.json();

      setWeather({
        city: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
        icon: "🌍",
      });
    } catch (err) {
      setError(err.message || "Unable to load weather. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-icon">☀</span>
          SkyCast
        </a>
        <span className="live-label">
          <span className="live-dot" />
          Weather dashboard
        </span>
      </header>

      <section className="hero" id="home">
        <p className="eyebrow">YOUR DAILY WEATHER COMPANION</p>
        <h1>
          Find your city.
          <br />
          <span>Feel the forecast.</span>
        </h1>
        <p className="subtitle">
          Discover current weather conditions for any city around the world.
        </p>

        <form className="search-form" onSubmit={searchWeather}>
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            aria-label="Search city"
            placeholder="Enter a city, e.g. Mumbai"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search weather"}
          </button>
        </form>

        <div className="suggestions">
          <span>Try:</span>
          {["Mumbai", "London", "Delhi"].map((name) => (
            <button
              key={name}
              type="button"
              className="city-chip"
              onClick={() => {
                setCity(name);
                setWeather(null);
                setError("");
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {error && (
          <p className="error-message" role="alert">
            <span aria-hidden="true">⚠</span> {error}
          </p>
        )}

        {weather && (
          <section className="weather-card" aria-label="Weather results">
            <div className="weather-location">
              <div>
                <p className="card-label">CURRENT WEATHER</p>
                <h2>{weather.city}</h2>
                <p className="condition">{weather.condition}</p>
              </div>
              <span className="weather-icon" aria-hidden="true">
                {weather.icon}
              </span>
            </div>

            <div className="temperature">
              <span>{weather.temperature}</span>
              <sup>°C</sup>
            </div>

            <div className="weather-details">
              <div className="detail">
                <span>💧</span>
                <div>
                  <p>Humidity</p>
                  <strong>{weather.humidity}%</strong>
                </div>
              </div>
              <div className="detail">
                <span>🌬️</span>
                <div>
                  <p>Wind speed</p>
                  <strong>{weather.wind} km/h</strong>
                </div>
              </div>
            </div>
          </section>
        )}
      </section>

      <footer>
        <p>SkyCast · Weather at a glance</p>
        <p>Powered by OpenWeather when an API key is configured.</p>
      </footer>
    </main>
  );
}
