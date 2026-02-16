import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DefaultQueryDto } from './dto/search/default.query.dto';
import { MakesResponseDto } from './dto/car_makes/makes.response.dto';
import { lastValueFrom } from 'rxjs';
import { GetModelsQueryDto } from './dto/car_models/get-models.query.dto';
import { ModelsResponseDto } from './dto/car_models/models.response.dto';

@Injectable()
export class VehicleDataService {
  constructor(
    @Inject('LISTING_SERVICE') private readonly vehicleClient: ClientKafka,
  ) {}

  async getMakes(query: DefaultQueryDto): Promise<MakesResponseDto> {
    try {
      const payload = { ...query };
      const response = await lastValueFrom(
        this.vehicleClient.send('vehicle-data.get-makes', payload),
      );
      return response;
    } catch (err) {
      console.error('[VehicleService] Error fetching makes:', err);
      throw new InternalServerErrorException(
        '[VehicleService] Error fetching makes:',
        err.message,
      );
    }
  }

  async getModelsByMake(query: GetModelsQueryDto): Promise<ModelsResponseDto> {
    try {
      const payload = { ...query };
      const response = await lastValueFrom(
        this.vehicleClient.send('vehicle-data.get-models', payload),
      );
      return response;
    } catch (err) {
      console.error('[VehicleService] Error fetching models:', err);
      throw new InternalServerErrorException(
        '[VehicleService] Error fetching models:',
        err.message,
      );
    }
  }
}
