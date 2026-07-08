import { BadGatewayException, Injectable } from '@nestjs/common';

export interface IGeocodeResult {
  name: string;
  country?: string;
  lat: number;
  lng: number;
}

@Injectable()
export class CitiesService {

  private readonly API_URL = "https://geocoding-api.open-meteo.com/v1/search";

  private async searchCities(city: string): Promise<IGeocodeResult[]> {
    const res = await fetch(`${this.API_URL}?name=${encodeURIComponent(city)}&language=ru&format=json`);

    if (!res.ok) throw new Error(`Не удалось найти город ${res.status}`);

    const data = await res.json();
    return (data.results || []).map((c) => ({
      name: c.name,
      country: c.country,
      lat: c.latitude,
      lng: c.longitude,
    }));
  }

  async search(city: string) {
    if (city.trim().length < 2) return [];

    try {
      return await this.searchCities(city);
    } catch (err) {
      throw new BadGatewayException("Сервис геолокации недоступен");
    }
  }
}
