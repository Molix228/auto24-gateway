import { ApiProperty } from '@nestjs/swagger';
import { ListingResponseDto } from './listing.model';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    isArray: true,
    description: 'List of items for the current page',
    type: ListingResponseDto,
  })
  items: T[];
  @ApiProperty({
    example: 100,
    description: 'Total number of items available',
  })
  total: number;
  @ApiProperty({
    example: 1,
    description: 'Current page number',
  })
  page: number;
  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
  })
  limit: number;
  @ApiProperty({
    example: 10,
    description: 'Total number of pages available',
  })
  totalPages: number;
  @ApiProperty({
    example: true,
    description: 'Indicates if there is a next page',
  })
  hasNextPage: boolean;
  @ApiProperty({
    example: false,
    description: 'Indicates if there is a previous page',
  })
  hasPreviousPage: boolean;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasNextPage = page < this.totalPages;
    this.hasPreviousPage = page > 1;
  }
}
