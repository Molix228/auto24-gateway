import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { IsGreaterThan } from 'src/validators/greater.decorator';

export class DateRangeDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsGreaterThan('from', {
    message: '[End Date] cannot be less than [Start date]',
  })
  to: Date;
}
