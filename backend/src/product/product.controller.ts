import { Controller, Get, Post, Body, Param, NotFoundException} from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "@prisma/client";

@Controller("products")
export class ProductController{
    constructor(private readonly productService: ProductService){}

        @Get()
        async getAllProducts(){
            return this.productService.getAllProducts()
        }

        @Get(":id")
        async getProductById(@Param('id') id: string){
            const productFound= await this.productService.getProductById(Number(id))
            if (!productFound) throw new NotFoundException('No se encontro ese producto')
            return productFound
        }

        @Post("/products")
        async createProduct(@Body() data: Product){
            return this.productService.createProduct(data)
        }
}