import { Module } from '@nestjs/common';
import { ListingController } from './listing.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ListingService } from './listing.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'LISTING_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'listing-service-client',
              brokers: [configService.get<string>('KAFKA_BROKER') || ''],
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ListingController],
  providers: [ListingService],
  exports: [ListingService],
})
export class ListingModule {}
