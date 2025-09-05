import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ListingFiltersDto } from './listing-filter.dto';
import { PaginationDto } from './pagination.dto';

export class GetListingsDto {
  @ValidateNested()
  @Type(() => ListingFiltersDto)
  filters: ListingFiltersDto;

  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;
}
