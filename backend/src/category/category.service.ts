import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryUpdateDTO } from './dto/category-update.dto';
import { CategoryCreateDTO } from './dto/category-create.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  public async getAllCategories() {
    try {
      return await this.prismaService.category.findMany({
        orderBy: {
          id: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async getCategoryByCode(id: number) {
    try {
      const existCategory = await this.prismaService.category.findUnique({
        where: { id: id },
      });
      if (!existCategory) {
        throw new BadRequestException(
          'La categoria que se intenta obtener no existe',
        );
      }
      return existCategory;
    } catch (error) {
      throw error;
    }
  }

  public async createCategory(newCategory: CategoryCreateDTO) {
    try {
      const existCategory = await this.prismaService.category.findUnique({
        where: { name: newCategory.name.toUpperCase() },
      });
      if (existCategory) {
        throw new BadRequestException(
          'La categoria que se intenta crear ya existe',
        );
      }

      const category = await this.prismaService.category.create({
        data: {
          name: newCategory.name.toUpperCase(),
        },
      });

      return category;
    } catch (error) {
      throw error;
    }
  }

  public async updateCategoryByCode(id: number, category: CategoryUpdateDTO) {
    try {
      const existCategory = await this.prismaService.category.findUnique({
        where: { id: id },
      });
      if (!existCategory) {
        throw new BadRequestException(
          'La categoria que se intenta editar no existe',
        );
      }

      const updateCategory = await this.prismaService.category.update({
        where: { id: id },
        data: { name: category.name.toUpperCase() },
      });

      return updateCategory;
    } catch (error) {
      throw error;
    }
  }

  public async deleteCategory(id: number) {
    try {
      const existCategory = await this.prismaService.category.findUnique({
        where: { id: id },
      });
      if (!existCategory) {
        throw new BadRequestException(
          'La categoria que se intenta eliminar no existe',
        );
      }

      const deletedCategory = await this.prismaService.category.delete({
        where: { id: id },
      });

      return deletedCategory;
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException(
          'La categoría que se intenta eliminar tiene productos asociados',
        );
      }
      throw new InternalServerErrorException(error);
    }
  }
}
