import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { ListingFiltersDto } from './listing-filter.dto';
import { PaginationDto } from './pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetListingsDto {
  @ApiProperty({
    type: ListingFiltersDto,
    description: 'Filters for listing retrieval',
  })
  @ValidateNested()
  @IsDefined()
  @Type(() => ListingFiltersDto)
  filters: ListingFiltersDto;

  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination details for listing retrieval',
  })
  @ValidateNested()
  @IsDefined()
  @Type(() => PaginationDto)
  pagination: PaginationDto;
}
