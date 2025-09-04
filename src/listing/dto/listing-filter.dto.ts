import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortOrder } from 'src/enums/sort-order.enum';

export class ListingFiltersDto {
  @IsOptional()
  @IsString()
  searchText: string;

  @IsOptional()
  @IsString()
  @IsArray()
  makes: string[];

  @IsOptional()
  @IsString()
  @IsArray()
  models: string[];

  @IsOptional()
  @IsObject()
  priceRange: { min: number; max: number };

  @IsOptional()
  @IsObject()
  dateRange: { from: Date; to: Date };

  @IsOptional()
  @IsEnum(SortOrder, { each: true })
  sortBy: SortOrder;
}
