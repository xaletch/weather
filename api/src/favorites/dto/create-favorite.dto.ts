import { IsString, MinLength, IsOptional, IsNumber } from "class-validator";

export class CreateFavoriteDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;
}
