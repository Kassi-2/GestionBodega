import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Invoice } from '@prisma/client';

@Injectable()
export class InvoiceService {
  constructor(private prismaService: PrismaService) {}

  public async findAll(): Promise<Invoice[]> {
    try {
      const invoices = await this.prismaService.invoice.findMany({
        where: { state: true },
        include: {
          invoiceCategory: {
            select: { category: true },
          },
        },
      });
      return invoices;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async findOne(id: number) {
    try {
      const invoice = await this.prismaService.invoice.findUnique({
        where: { id, state: true },
      });

      if (!invoice) {
        throw new NotFoundException(
          'La factura que se intenta obtener no existe',
        );
      }

      return invoice;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async remove(id: number) {
    try {
      const deletedInvoice = await this.prismaService.invoice.update({
        where: { id },
        data: { state: false },
      });

      return deletedInvoice;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          'La factura que se intenta eliminar no existe',
        );
      }
      throw new InternalServerErrorException(error);
    }
  }
}
