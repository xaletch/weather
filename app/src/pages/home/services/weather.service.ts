import type { IAddFavoritesCredentials, ICitySearch, IFavorites, IWeather } from "../module/types/home.type";

class WeatherService {
  private readonly BASE_URL = "http://localhost:8080";

  async citySearch(city: string): Promise<ICitySearch[]> {
    const res = await fetch(`${this.BASE_URL}/search/city?city=${encodeURIComponent(city)}`);
    if (!res.ok) throw new Error("Не удалось найти город");
    return res.json();
  }

  async getFavorites(): Promise<IFavorites[]> {
    const res = await fetch(`${this.BASE_URL}/favorites`);
    if (!res.ok) throw new Error("Не удалось загрузить избранное");
    return res.json();
  }

  async addFavorites(body: IAddFavoritesCredentials): Promise<IFavorites> {
    const res = await fetch(`${this.BASE_URL}/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Не удалось добавить город");
    return res.json();
  }

  async deleteFavorite(cityId: number): Promise<void> {
    const res = await fetch(`${this.BASE_URL}/favorites/${cityId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Не удалось удалить избранный город");
  }

  async getWeather(): Promise<IWeather[]> {
    const res = await fetch(`${this.BASE_URL}/weather`);
    if (!res.ok) throw new Error("Не удалось загрузить погоду");
    return res.json();
  }
}

export const weatherService = new WeatherService();
