import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.weatherService.getAll();
  }
}
