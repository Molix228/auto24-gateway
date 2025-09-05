import { Module } from '@nestjs/common';
import { ListingController } from './listing.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ListingService } from './listing.service';
import { AuthModule } from 'src/auth/auth.module';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    AuthModule,
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
              connectionTimeout: 3000,
              requestTimeout: 25000,
            },
            consumer: {
              groupId: 'api-gateway-listing-consumer',
              sessionTimeout: 30000,
              heartbeatInterval: 3000,
            },
            producer: {
              createPartitioner: Partitioners.LegacyPartitioner,
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
