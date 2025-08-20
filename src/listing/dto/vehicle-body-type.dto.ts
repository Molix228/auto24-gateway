import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { PassengerCarBodyType } from '../../enums/passenger-car-bodytype.enum';
import { SuvBodyType } from '../../enums/suv-bodytype.enum';
import { TruckBodytype } from '../../enums/truck-bodytype.enum';
import { CommertialBodyType } from '../../enums/commertial-vehicle.enum';

export class VehicleBodyTypesDto {
  @IsOptional()
  @IsArray()
  @IsEnum(PassengerCarBodyType, { each: true })
  passengerCar?: PassengerCarBodyType[];

  @IsOptional()
  @IsArray()
  @IsEnum(SuvBodyType, { each: true })
  SUV?: SuvBodyType[];

  @IsOptional()
  @IsArray()
  @IsEnum(TruckBodytype, { each: true })
  truck?: TruckBodytype[];

  @IsOptional()
  @IsArray()
  @IsEnum(CommertialBodyType, { each: true })
  commertial?: CommertialBodyType[];
}
