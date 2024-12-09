import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, AuthGuard],
  imports: [PrismaModule, ConfigModule],
})
export class CategoryModule {}
