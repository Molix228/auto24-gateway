import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ListingModule } from 'src/listing/listing.module';
import { VehicleDataService } from './vehicle-data.service';
import { VehicleDataController } from './vehicle-data.controller';

@Module({
  imports: [AuthModule, ListingModule],
  providers: [VehicleDataService],
  controllers: [VehicleDataController],
  exports: [VehicleDataService],
})
export class VehicleDataModule {}
