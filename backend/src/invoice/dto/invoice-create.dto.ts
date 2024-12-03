import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';

export class InvoiceCreateDTO {
  @IsString()
  purchaseOrderNumber: string;

  @IsDate()
  shipmentDate: Date;

  @IsOptional()
  @IsDate()
  registrationDate?: Date;

  @IsOptional()
  @IsInt()
  categoryId: number;
}
