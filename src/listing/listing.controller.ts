import { Body, Controller, Post } from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingInputDto } from './dto/create-listing-input.dto';

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post('create_ad')
  async createNewAd(@Body() createAdDto: CreateListingInputDto) {
    return this.listingService.createNewAd(createAdDto);
  }
}
