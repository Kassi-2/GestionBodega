import { UserType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserImportDTO {
  @IsNotEmpty()
  @IsString()
  @IsEnum(UserType)
  type: UserType;

  @IsOptional()
  @IsString()
  degree: string;

  @IsNotEmpty()
  file: File;
}
