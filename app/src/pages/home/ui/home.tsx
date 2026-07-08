import { useCallback, useEffect, useState } from "react"
import type { IAddFavoritesCredentials, IWeather } from "../module/types/home.type";
import { weatherService } from "../services/weather.service";
import { Card } from "./components/card";
import { CitySearch } from "./components/city-search";

type WeatherState = {
  data: IWeather[];
  isLoading: boolean;
  error: string | null;
}

export const Home = () => {

  const [data, setData] = useState<WeatherState>({ data: [], isLoading: true, error: null });

  const fetchWeather = useCallback(async () => {
    try {
      const data = await weatherService.getWeather();
      setData(p => ({ ...p, data: data, error: null }));
    } catch {
      setData(p => ({ ...p, error: "Не удалось получить данные о погоде" }));
    }
    finally {
      setData(p => ({ ...p, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const handleAdd = async (city: IAddFavoritesCredentials) => {
    try {
      await weatherService.addFavorites(city);
      await fetchWeather();
    } catch (err) {
      console.log(`ОШИБКА ПРИ ДОБАВЛЕНИИ ГОРОДА: ${err}`);
    }
  }

  const handleDelete = async (cityId: number) => {
    try {
      await weatherService.deleteFavorite(cityId);
      setData((prev) => ({ ...prev, data: prev.data.filter(w => w.cityId !== Number(cityId)) }));
    } catch (err) {
      console.log(`ОШИБКА ПРИ УДАЛЕНИИ ГОРОДА ${err}`);
    }
  }

  return (
    <div className="flex py-20 justify-center flex-col max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Погода</h1>

      <CitySearch handleAdd={handleAdd} />

      {data.error && <div className="text-red-500 text-center text-sm">{data.error}</div>}
      {data.isLoading && <div>Загрузка...</div>}

      <div className="grid grid-cols-3 gap-2.5">
        {data.data.map((weather, idx) => (
          <Card key={idx} weather={weather} onDelete={handleDelete} />
        ))}
      </div>

      {!data.isLoading && data.data.length == 0 && <div className="text-center py-20 text-gray-500">Нет избранных городов</div>}

    </div>
  )
}
