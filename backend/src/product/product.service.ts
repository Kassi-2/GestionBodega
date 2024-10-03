import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { product } from '@prisma/client';
import { ProductCreateDTO } from './dto/product-create.dto';
import { ProductUpdateDTO } from './dto/product-update.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  //Obtener todos los productos de la tabla product de la base de datos
  //Devuelve un array de solo los productos que tienen estado true=activo,
  //y los entrega ordenados alfabéticamente por nombre ascendentemente
  async getActiveProductsNameAsc(): Promise<product[]> {
    return this.prisma.product.findMany({
      where: {
        state: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  //Obtener todos los productos de la tabla product de la base de datos
  //Devuelve un array de solo los productos que tienen estado true=activo,
  //y los entrega ordenados alfabéticamente por nombre descendentemente
  async getActiveProductsNameDesc(): Promise<product[]> {
    return this.prisma.product.findMany({
      where: {
        state: true,
      },
      orderBy: {
        name: 'desc',
      },
    });
  }

  //Obtener todos los productos de la tabla product de la base de datos
  //Devuelve un array de solo los productos que tienen estado true=activo,
  //y los entrega ordenados ascendentemente por stock
  async getActiveProductsStockAsc(): Promise<product[]> {
    return this.prisma.product.findMany({
      where: {
        state: true,
      },
      orderBy: {
        stock: 'asc',
      },
    });
  }

  //Obtener todos los productos de la tabla product de la base de datos
  //Devuelve un array de solo los productos que tienen estado true=activo,
  //y los entrega ordenados descendentemente por stock
  async getActiveProductsStockDesc(): Promise<product[]> {
    return this.prisma.product.findMany({
      where: {
        state: true,
      },
      orderBy: {
        stock: 'desc',
      },
    });
  }
  //Obtener todos los productos de la tabla product de la base de datos
  //Devuelve un array de solo los productos que tienen un stock mayor a 0
  //y los entrega ordenados alfabéticamente por nombre
  async getAvailableProducts(): Promise<product[]> {
    return this.prisma.product.findMany({
      where: {
        stock: { gt: 0 },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  //Obtener un solo producto por su id
  //Devuelve el producto que coinicide con el id ingresado
  async getProductById(id: number): Promise<product> {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  //Crear un producto ingresando los datos del modelo de Producto
  //devuelve los parámetros con los que fue creado el producto
  //verifica que no exista un prducto ya creado con el mismo nombre
  //revisa en los productos eliminados si ya existía un producto con el mismo nombre
  //si existía se actualizan los valores por los nuevos ingresados
  async createProduct(data: ProductCreateDTO): Promise<product> {
    const buscarProduct = await this.prisma.product.findUnique({
      where: {
        name: data.name,
      },
    });
    if (buscarProduct) {
      if (buscarProduct.state === false) {
        return this.prisma.product.update({
          where: {
            id: buscarProduct.id,
          },
          data: {
            ...data,
            state: true,
          },
        });
      } else {
        throw new BadRequestException('Ya existe un producto con ese nombre');
      }
    }
    return this.prisma.product.create({
      data,
    });
  }

  //Eliminar un producto, pero no se borra de la base de datos
  //primero busca que el producto esté en la base de datos, y además tenga estado true
  //solo se actualiza el estado del producto de "activo" "desactivo", true a false
  async deleteProduct(id: number): Promise<product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product || product.state !== true) {
      throw new NotFoundException('No se encontró el producto');
    }
    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        state: false,
      },
    });
  }

  //Actualizar un producto, verifica que exista el producto con estado activo.
  //Verifica si existe el nombre del producto que se quiere editar en la base de datos
  //con estado activo o inactivo, si está activo se le avisa que ya hay un producto con ese nombre
  //si está inactivo se actualiza el nombre, pero el producto antiguo se le agrega "-{id}"
  async updateProduct(id: number, data: ProductUpdateDTO): Promise<product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product || product.state !== true) {
      throw new NotFoundException('No se encontró el producto');
    }
    if (data.name && data.name !== product.name) {
      const findProduct = await this.prisma.product.findFirst({
        where: {
          name: data.name,
          id: {
            not: id,
          },
        },
      });

      if (findProduct && findProduct.state === true) {
        throw new BadRequestException('Ya existe un producto con ese nombre');
      }

      if (findProduct && findProduct.state === false) {
        const updateName = `${findProduct.name}-${findProduct.id}`;
        await this.prisma.product.update({
          where: { id: findProduct.id },
          data: {
            name: updateName,
          },
        });
        return this.prisma.product.update({
          where: { id },
          data,
        });
      }
    }
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }
}
