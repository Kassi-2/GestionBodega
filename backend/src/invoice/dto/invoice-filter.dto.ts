import { Type } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class InvoiceFilterDTO {
  @IsOptional()
  @Type(() => Date)
  startDate: Date;

  @IsString()
  @IsOptional()
  endDate: string;

  @IsOptional()
  categories: number[];
}
