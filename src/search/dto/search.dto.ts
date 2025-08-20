import { IsEnum, IsOptional } from 'class-validator';
import { PassengerCarBodyType } from 'src/enums/passenger-car-bodytype.enum';

export class SearchVehicleDto {
  @IsOptional()
  @IsEnum(PassengerCarBodyType, { each: true })
  passengerCar: PassengerCarBodyType[];
}
