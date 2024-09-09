import { Controller, Get, Post, Body, Param, NotFoundException, ValidationPipe, BadRequestException} from "@nestjs/common";
import { ProductService } from "./product.service";
import { product } from "@prisma/client";
import { ProductCreateDTO } from "./dto/product-crate.dto";

@Controller("products")
export class ProductController{
    constructor(private readonly productService: ProductService){}

        @Get("/active")
        async getActiveProducts(){
            return this.productService.getActiveProducts()
        }

        @Get("/available")
        async getAvailableProducts(){
            return this.productService.getAvailableProducts()
        }

        @Get(":id")
        async getProductById(@Param('id') id: string){
            const productFound= await this.productService.getProductById(Number(id))
            if (!productFound) throw new NotFoundException('No se encontro ese producto')
            return productFound
        }

        @Post()
        async createProduct(@Body(ValidationPipe) request: ProductCreateDTO){
            if (!request.name) {
                throw new BadRequestException("Ingresa un nombre del producto");
              }
              if (request.stock<0){
                throw new BadRequestException("El stock debe ser un número igual o mayor a 0");
              }
            return this.productService.createProduct(request)
        }
}