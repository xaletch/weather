import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller()
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get("search/city")
  @HttpCode(HttpStatus.OK)
  search(@Query("city") city: string) {
    return this.citiesService.search(city);
  }
}
