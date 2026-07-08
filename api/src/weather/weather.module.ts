import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherCronService } from './weather.cron';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherCronService],
})
export class WeatherModule {}
