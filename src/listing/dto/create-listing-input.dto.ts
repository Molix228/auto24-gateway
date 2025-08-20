import { PartialType } from '@nestjs/mapped-types';
import { VehicleBodyTypesDto } from './vehicle-body-type.dto';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateListingInputDto extends PartialType(VehicleBodyTypesDto) {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsDate()
  @IsNotEmpty()
  initialReg: Date;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsNotEmpty()
  images: string[];
}
