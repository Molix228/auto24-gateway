import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingInputDto } from './dto/create-listing-input.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ListingFiltersDto } from './dto/listing-filter.dto';
import { PaginationDto } from './dto/pagination.dto';
import { GetListingsDto } from './dto/get-listings.dto';

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Get('find')
  async getListings(
    @Query() filters: ListingFiltersDto,
    @Query() pagination: PaginationDto,
  ) {
    const listingsDto = new GetListingsDto();
    listingsDto.filters = filters;
    listingsDto.pagination = pagination;

    return await this.listingService.getListings(listingsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create_ad')
  async createNewAd(@Body() createAdDto: CreateListingInputDto, @Req() req) {
    return this.listingService.createNewAd(createAdDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete_ad/:id')
  async deleteAd(@Param('id') id: string, @Req() req) {
    return this.listingService.deleteAd(id, req.user.userId);
  }
}
