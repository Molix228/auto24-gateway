import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateListingInputDto } from './dto/create-listing-input.dto';
import { plainToInstance } from 'class-transformer';
import { lastValueFrom, timeout } from 'rxjs';
import { GetListingsDto } from './dto/get-listings.dto';

@Injectable()
export class ListingService implements OnModuleInit {
  constructor(
    @Inject('LISTING_SERVICE') private readonly listingClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.listingClient.subscribeToResponseOf('listing.create-ad');
    this.listingClient.subscribeToResponseOf('listing.delete-ad');

    await this.listingClient.connect();
  }
  async getListings(listingsDto: GetListingsDto) {
    try {
      const listings = await lastValueFrom(
        this.listingClient.send('listing.find', listingsDto),
      );
      if (!listings)
        throw new InternalServerErrorException('Failed to find listings');
      return listings;
    } catch (err) {
      console.error('[ListingService] Error finding listings: ', err);
      throw new InternalServerErrorException(
        'Error finding listings',
        err.message,
      );
    }
  }

  async createNewAd(createAdDto: CreateListingInputDto, userId: string) {
    const adPayload = { createAdDto, userId };

    try {
      const createdAd = await lastValueFrom(
        this.listingClient
          .send('listing.create-ad', adPayload)
          .pipe(timeout(5000)),
      );
      if (!createdAd) {
        throw new InternalServerErrorException('Failed to create ad');
      }
      return createdAd;
    } catch (err) {
      console.error('[ListingService] Error creating ad:', err);
      throw new InternalServerErrorException('Error creating ad', err.message);
    }
  }

  async deleteAd(id: string, userId: string): Promise<void> {
    try {
      const listing = await lastValueFrom(
        this.listingClient
          .send('listing.delete-ad', { id, userId })
          .pipe(timeout(5000)),
      );
      if (!listing)
        throw new InternalServerErrorException('Failed to delete ad');
      return listing;
    } catch (err) {
      console.error('[ListingService] Error deleting ad:', err);
      throw new InternalServerErrorException('Error deleting ad', err.message);
    }
  }
}
