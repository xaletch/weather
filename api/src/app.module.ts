import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CitiesModule } from './cities/cities.module';
import { FavoritesModule } from './favorites/favorites.module';
import { WeatherModule } from './weather/weather.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    CitiesModule,
    FavoritesModule,
    WeatherModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
