import { IsString, IsOptional } from 'class-validator';

export class CategoryUpdateDTO {
  @IsOptional()
  @IsString()
  name: string;
}
