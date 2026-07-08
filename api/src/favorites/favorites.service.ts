import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { fetchWeather } from 'src/shared/clients/weather.client';

@Injectable()
export class FavoritesService {
  constructor (private readonly prismaService: PrismaService) {}

  async create(dto: CreateFavoriteDto) {
    const city = await this.prismaService.city.upsert({
      where: {
        name_lat_lng: {
          name: dto.name,
          lat: dto.lat,
          lng: dto.lng,
        }
      },
      create: { ...dto },
      update: { },
    });

    await this.prismaService.favorite.upsert({
      where: { cityId: city.id },
      update: { cityId: city.id },
      create: { cityId: city.id },
    });

    try {
      const weather = await fetchWeather(dto.lat, dto.lng);
      await this.prismaService.weather.create({
        data: {
          cityId: city.id,
          temperature: weather.temperature,
          windSpeed: weather.wind_speed,
          code: weather.weather_code,
          rawData: weather.raw as any,
          success: true,
        },
      });
    } catch (err) {
      await this.prismaService.weather.create({
        data: {
          cityId: city.id,
          success: false,
          errorMessage: (err as Error).message,
        },
      });
    }

    return city;
  }

  async findAll() {
    const favorite = await this.prismaService.favorite.findMany({
      select: {
        city: true
      },
      orderBy: { createdAt: "asc" },
    });

    return favorite.map((c) => ({
      id: c.city.id,
      name: c.city.name,
      country: c.city.country,
      lat: c.city.lat,
      lng: c.city.lng,
    }))
  }

  async remove(cityId: number) {
    await this.prismaService.favorite.deleteMany({ where: { cityId } });
  }
}
