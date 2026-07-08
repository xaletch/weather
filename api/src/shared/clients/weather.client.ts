export interface ICurrentWeather {
  temperature: number;
  weather_code: number;
  wind_speed: number;
  raw: unknown;
}

const API_URL = "https://api.open-meteo.com/v1/forecast";

export const fetchWeather = async (lat: number, lng: number): Promise<ICurrentWeather> => {
  const res = await fetch(`${API_URL}?latitude=${lat}&longitude=${lng}&current_weather=true`);
  if (!res.ok) throw new Error(`Не удалось загрузить информацию о погоде ${res.status}`);

  const data = await res.json();
  const weather = data.current_weather;

  if (!weather) throw new Error("Не удалось определить текущую погоду");

  return {
    temperature: weather.temperature,
    weather_code: weather.weathercode,
    wind_speed: weather.windspeed,
    raw: data,
  };
}
