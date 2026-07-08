import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(createFavoriteDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.favoritesService.findAll();
  }

  @Delete(':city_id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('city_id') cityId: number) {
    return this.favoritesService.remove(cityId);
  }
}
