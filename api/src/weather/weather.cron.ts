import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "src/prisma/prisma.service";
import { fetchWeather } from "src/shared/clients/weather.client";

const INTERVAL_MINUTES = Number(process.env.FETCH_INTERVAL_MINUTES || 4);

@Injectable()
export class WeatherCronService implements OnModuleInit {
  private readonly logger = new Logger(WeatherCronService.name);
  constructor (private readonly prismaService: PrismaService) {}
  
  onModuleInit() {
    this.run().catch((err) => this.logger.error("Init cron failed", err));
  }

  @Cron(`*/${INTERVAL_MINUTES} * * * *`)
  async handle() {
    await this.run();
  }

  async run() {
    const favorites = await this.prismaService.favorite.findMany({ select: { city: true } });

    await Promise.all(
      favorites.map(f => this.fetchStore(f.city.id, f.city.lat, f.city.lng))
    );
  }

  private async fetchStore(cityId: number, lat: number, lng: number) {
    try {
      const weather = await fetchWeather(lat, lng);
      await this.prismaService.weather.create({
        data: {
          cityId,
          temperature: weather.temperature,
          windSpeed: weather.wind_speed,
          code: weather.weather_code,
          rawData: weather.raw as any,
          success: true,
        }
      });
      this.logger.log(`Данные обновлены. Город: ${cityId}.`);
    } catch (err) {
      await this.prismaService.weather.create({
        data: {
          cityId,
          success: false,
        }
      });
      this.logger.error(`Не удалось обновить данные. Город: ${cityId}. Ошибка: ${(err as Error).message}`);
    }
  }
}