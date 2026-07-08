export interface ICitySearch {
  name: string;
  country: string;
  lat: number;
  lng: number;
}


export interface IFavorites {
  id: number;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export interface IAddFavoritesCredentials {
  name: string;
  country?: string;
  lat: number;
  lng: number;
}

export interface IWeather {
  cityId: number;
  name: string;
  country: string | null;
  temperature: number | null;
  code: number | null;
  wind_speed: number | null;
  fetched_at: string | null;
  has_data: boolean;
  is_stale: boolean;
  is_service_down: boolean;
  message: string | null;
}
