import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  imports: [PrismaModule],
})
export class InvoiceModule {}
