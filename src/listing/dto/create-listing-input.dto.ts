import {
  IsArray,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateListingInputDto {
  @IsNumber()
  @IsNotEmpty()
  makeId: number;

  @IsNumber()
  @IsNotEmpty()
  modelId: number;

  @IsNumber()
  @IsNotEmpty()
  bodyTypeId: number;

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
