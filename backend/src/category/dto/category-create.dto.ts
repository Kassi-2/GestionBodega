import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryCreateDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
