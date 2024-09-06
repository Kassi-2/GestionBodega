import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma/prisma.service";
import { Product } from "@prisma/client";

@Injectable()
export class ProductService{

    constructor(private prisma: PrismaService){}

    //Obtener todos los productos de la tabla product de la base de datos
    //Devuelve un array de los productos
    async getAllProducts(): Promise <Product[]>{
        return this.prisma.product.findMany();
    }

    //Obtener un solo producto por su id
    //Devuelve el producto que coinicide con el id ingresado
    async getProductById(id: number): Promise <Product>{
        return this.prisma.product.findUnique({
            where:{
                id
            }
        })
    }

    //Crear un producto ingresando los datos del modelo de Producto
    //devuelve los parámetros con los que fue creado el producto
    async createProduct(data: Product): Promise<Product>{
        return this.prisma.product.create({
            data
        })
    }

}