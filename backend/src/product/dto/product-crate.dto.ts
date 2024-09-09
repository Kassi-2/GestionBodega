import { IsNotEmpty, IsString, IsNumber, IsOptional} from 'class-validator';

export class ProductCreateDTO {

    @IsNotEmpty()
    @IsString()
    name : string;
    
    @IsOptional()
    @IsString()
    description : string;

    @IsOptional()
    @IsNumber()
    stock : number;

    @IsOptional()
    @IsNumber()
    criticalStock : number;

}