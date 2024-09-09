import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { product } from "@prisma/client";
import { ProductCreateDTO } from "./dto/product-crate.dto";

@Injectable()
export class ProductService{

    constructor(private prisma: PrismaService){}

    //Obtener todos los productos de la tabla product de la base de datos
    //Devuelve un array de solo los productos que tienen estado activo, 
    //y los entrega ordenados alfabéticamente
    async getActiveProducts(): Promise <product[]>{
        return this.prisma.product.findMany({
            where:{
                state: "activo",
            },
            orderBy:{
                name: "asc",
            }
        });
    }
    //Obtener todos los productos de la tabla product de la base de datos
    //Devuelve un array de solo los productos que tienen un stock mayor a 0
    //y los entrega ordenados alfabéticamente
    async getAvailableProducts(): Promise <product[]>{
        return this.prisma.product.findMany({
            where:{
                stock: { gt : 0 },
            },
            orderBy:{
                name: "asc",
            }
        });
    }

    //Obtener un solo producto por su id
    //Devuelve el producto que coinicide con el id ingresado
    async getProductById(id: number): Promise <product>{
        return this.prisma.product.findUnique({
            where:{
                id
            }
        })
    }

    //Crear un producto ingresando los datos del modelo de Producto
    //devuelve los parámetros con los que fue creado el producto
    //verifica que no exista un prducto ya creado con el mismo nombre
    async createProduct(data: ProductCreateDTO): Promise<product>{
        const buscarProduct= await this.prisma.product.findUnique({
            where: {
                name: data.name
            },
        });
        if (buscarProduct){
            throw new BadRequestException("Ya existe un producto con ese producto");
        }
        return this.prisma.product.create({
            data,
        });
    }
    
    //Eliminar un producto, pero no se borra de la base de datos
    //solo se actualiza el estado del producto de "activo" "desactivo"
    async deleteProduct(id:number){

    }

}