import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

const STALE_THRESHOLD_MINUTES = Number(process.env.STALE_THRESHOLD_MINUTES || 8);

interface IWeatherSnapshot {
  id: number;
  cityId: number;
  temperature: number | null;
  code: number | null;
  windSpeed: number | null;
  rawData: any | null;
  success: boolean;
  fetchedAt: Date;
  errorMessage: string | null;
}

@Injectable()
export class WeatherService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const favorites = await this.prismaService.favorite.findMany({
      include: {
        city: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!favorites.length) {
      return [];
    }

    const cityIds = favorites.map((f) => f.cityId);

    const weathers = await this.prismaService.weather.findMany({
      where: {
        cityId: {
          in: cityIds,
        },
      },
      orderBy: {
        fetchedAt: 'desc',
      },
    });

    const latest = new Map<number, IWeatherSnapshot>();
    const latestSuccess = new Map<number, IWeatherSnapshot>();
    
    for (const weather of weathers) {
      if (!latest.has(weather.cityId)) {
        latest.set(weather.cityId, weather);
      }
      
      if (weather.success && !latestSuccess.has(weather.cityId)) {
        latestSuccess.set(weather.cityId, weather);
      }
    }

    return favorites.map(({ city }) => {
      const last = latest.get(city.id);
      const success = latestSuccess.get(city.id);

      const isServiceDown = last ? !last.success : false;

      const ageMinutes = success
        ? (Date.now() - success.fetchedAt.getTime()) / 60000
        : null;

      const isStale =
        ageMinutes !== null &&
        ageMinutes > STALE_THRESHOLD_MINUTES;

      return {
        cityId: city.id,
        name: city.name,
        country: city.country,

        temperature: success?.temperature ?? null,
        code: success?.code ?? null,
        wind_speed: success?.windSpeed ?? null,
        fetched_at: success?.fetchedAt ?? null,

        has_data: !!success,
        is_stale: isStale,
        is_service_down: isServiceDown,

        message: isServiceDown
          ? 'Сервис погоды не отвечает. Показано последнее известное значение'
          : isStale
            ? 'Данные устарели'
            : null,
      };
    });
  }
}