import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ProductController],
  providers: [ProductService, AuthGuard],
  imports: [PrismaModule, ConfigModule],
})
export class ProductModule {}
