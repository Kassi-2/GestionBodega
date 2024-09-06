import { IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDTO {
  @IsNotEmpty()
  @IsString()
  run: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
