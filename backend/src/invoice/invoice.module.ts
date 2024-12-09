import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, PrismaService],
})
export class InvoiceModule {}
