import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryCreateDTO } from './dto/category-create.dto';
import { CategoryUpdateDTO } from './dto/category-update.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async getCategoryByCode(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getCategoryByCode(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createCategory(@Body() category: CategoryCreateDTO) {
    return await this.categoryService.createCategory(category);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  public async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() category: CategoryUpdateDTO,
  ) {
    return await this.categoryService.updateCategoryByCode(id, category);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  public async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.deleteCategory(id);
  }
}
