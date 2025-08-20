import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateListingInputDto } from './dto/create-listing-input.dto';
import { plainToInstance } from 'class-transformer';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ListingService {
  constructor(
    @Inject('LISTING_SERVICE') private readonly listingClient: ClientKafka,
  ) {}

  async createNewAd(createAdDto: CreateListingInputDto) {
    const adPayload = plainToInstance(Object, createAdDto);

    try {
      const createdAd = await lastValueFrom(
        this.listingClient.send('listing.create-ad', adPayload),
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
}
