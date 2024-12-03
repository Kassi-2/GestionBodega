import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Invoice } from '@prisma/client';
import * as FormData from 'form-data';
import * as fs from 'fs';
import axios from 'axios';
import { Readable } from 'stream';
import { InvoiceFilterDTO } from './dto/invoice-filter.dto';

@Injectable()
export class InvoiceService {
  constructor(private prismaService: PrismaService) {}

<<<<<<< HEAD
  //agregar una factura, además se le asigna una categoría
  //se crea un archivo localmente que es eliminado al terminar de ejecutar la función
  async processAndUploadFile(
=======
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

  public async processAndUploadFile(
>>>>>>> origin/dev5-leandro
    file: Express.Multer.File,
    purchaseOrderNumber: string,
    shipmentDate: string,
    categoryIds: number[],
<<<<<<< HEAD
    registrationDate: string
=======
    registrationDate: string,
>>>>>>> origin/dev5-leandro
  ) {
    try {
      const existingInvoice = await this.prismaService.invoice.findUnique({
        where: { purchaseOrderNumber },
      });

      if (existingInvoice) {
        throw new BadRequestException('El número de orden de compra ya existe');
      }
  
      for (const categoryId of categoryIds) {
        const existingCategory = await this.prismaService.category.findUnique({
          where: { id: categoryId },
        });

        if (!existingCategory) {
          throw new BadRequestException(
            `La categoría con ID ${categoryId} no existe`,
          );
        }
      }

      const fileContent = fs.readFileSync(file.path);
      const fileBase64 = fileContent.toString('base64');

      const uploadResult = await this.uploadToGoogleAppsScript(
        fileBase64,
        file.mimetype,
        file.originalname,
      );

      if (!uploadResult.success) {
        throw new BadRequestException('Error al intentar subir el archivo');
      }
<<<<<<< HEAD
  
      return await this.prisma.invoice.create({
=======

      const newInvoice = await this.prismaService.invoice.create({
>>>>>>> origin/dev5-leandro
        data: {
          purchaseOrderNumber,
          shipmentDate: new Date(shipmentDate),
          registrationDate: registrationDate
            ? new Date(registrationDate)
            : new Date(),
          fileUrl: uploadResult.fileUrl,
          invoiceCategory: {
            create: categoryIds.map((categoryId) => ({ categoryId })),
          },
        },
        include: {
          invoiceCategory: true,
        },
      });
<<<<<<< HEAD
=======

      fs.unlinkSync(file.path);
      return newInvoice;
>>>>>>> origin/dev5-leandro
    } catch (error) {
      console.error('Error procesando el archivo:', error.message);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('No se pudo procesar el archivo');
    } finally {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path); 
      }
    }
  }
  //editar una factura, se debe recibir siempre la o las categorías
  //se crea un archivo localmente que es eliminado al terminar de ejecutar la función
  async updateInvoice(
    id: number,
    purchaseOrderNumber?: string,
    shipmentDate?: string,
    registrationDate?: string,
    file?: Express.Multer.File,
    categoryIds?: number[]
  ) {
    try {
      const invoice = await this.prismaService.invoice.findUnique({
        where: { id },
        include: { invoiceCategory: { select: { categoryId: true } } },
      });

      if (!invoice) {
        throw new BadRequestException('La factura no existe');
      }

      if (categoryIds && categoryIds.length === 0) {
        throw new BadRequestException('Debe haber al menos una categoría asociada');
      }
  
      if (categoryIds && categoryIds.length > 0) {
        const validCategories = await this.prisma.category.findMany({
          where: { id: { in: categoryIds } },
          select: { id: true },
        });
  
        const validCategoryIds = validCategories.map((category) => category.id);
        const invalidCategoryIds = categoryIds.filter(
          (categoryId) => !validCategoryIds.includes(categoryId)
        );
  
        if (invalidCategoryIds.length > 0) {
          throw new BadRequestException(
            `Las siguientes categorías no existen: ${invalidCategoryIds.join(', ')}`
          );
        }
      }

      const existingCategoryIds = invoice.invoiceCategory.map(
        (ic) => ic.categoryId,
      );

      const categoriesToRemove = existingCategoryIds.filter(
        (categoryId) => !categoryIds?.includes(categoryId)
      );
<<<<<<< HEAD
  
      const categoriesToAdd = categoryIds?.filter(
        (categoryId) => !existingCategoryIds.includes(categoryId)
      );
  
=======

      const categoriesToAdd = categoryIds?.filter(
        (categoryId) => !existingCategoryIds.includes(categoryId),
      );

>>>>>>> origin/dev5-leandro
      if (categoriesToRemove.length > 0) {
        await this.prismaService.invoiceCategory.deleteMany({
          where: {
            invoiceId: id,
            categoryId: { in: categoriesToRemove },
          },
        });
      }

      if (categoriesToAdd?.length > 0) {
        await this.prismaService.invoiceCategory.createMany({
          data: categoriesToAdd.map((categoryId) => ({
            invoiceId: id,
            categoryId,
          })),
        });
      }

      let fileUrl: string | undefined;
      if (file) {
        const fileContent = fs.readFileSync(file.path);
        const fileBase64 = fileContent.toString('base64');

        const uploadResult = await this.uploadToGoogleAppsScript(
          fileBase64,
          file.mimetype,
          file.originalname
        );

        if (!uploadResult.success) {
          throw new BadRequestException('Error al intentar subir el archivo');
        }

        fileUrl = uploadResult.fileUrl;
      }
<<<<<<< HEAD
  
      return await this.prisma.invoice.update({
=======

      const updatedInvoice = await this.prismaService.invoice.update({
>>>>>>> origin/dev5-leandro
        where: { id },
        data: {
          purchaseOrderNumber,
          shipmentDate: shipmentDate ? new Date(shipmentDate) : undefined,
<<<<<<< HEAD
          registrationDate: registrationDate ? new Date(registrationDate) : undefined,
=======
          registrationDate: registrationDate
            ? new Date(registrationDate)
            : undefined,
>>>>>>> origin/dev5-leandro
          fileUrl,
        },
        include: { invoiceCategory: true },
      });
<<<<<<< HEAD
=======

      return updatedInvoice;
>>>>>>> origin/dev5-leandro
    } catch (error) {
      console.error('Error actualizando la factura:', error.message);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('No se pudo actualizar la factura');
    } finally {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
<<<<<<< HEAD
  //sube el archivo al drive
=======

>>>>>>> origin/dev5-leandro
  private async uploadToGoogleAppsScript(
    fileBase64: string,
    mimeType: string,
    fileName: string,
  ) {
    try {
      const form = new FormData();
      form.append('file', fileBase64);
      form.append('mimeType', mimeType);
      form.append('fileName', fileName);

      const response = await axios.post(
        'https://script.google.com/macros/s/AKfycby2ozFceSrD3xrrDzrzSofRjZW0XozV04Oz0ork71zJUUDRFRz51vyH11SkNYOSMMxm/exec',
        form,
        {
          headers: form.getHeaders(),
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error ejecutando Google Apps Script:', error.message);
      throw new Error('No se pudo subir el archivo');
    }
  }

  public async getInvoiceFile(
    id: number,
  ): Promise<{ stream: Readable; fileName: string }> {
    const invoice = await this.prismaService.invoice.findUnique({
      where: { id },
    });

    if (!invoice || !invoice.fileUrl) {
      throw new NotFoundException('El archivo no existe');
    }

    try {
      const fileId = invoice.fileUrl.split('/d/')[1].split('/')[0];
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

      const response = await axios.get(downloadUrl, { responseType: 'stream' });

      return {
        stream: response.data,
        fileName: `${invoice.purchaseOrderNumber}.pdf`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo descargar el archivo' + error.message,
      );
    }
  }

  async filterInvoices(filters: InvoiceFilterDTO) {
    const { startDate, endDate, categories } = filters;

    const conditions = [];

    if (startDate) {
      conditions.push({
        shipmentDate: {
          gte: new Date(startDate),
        },
      });
    }

    if (endDate) {
      conditions.push({
        shipmentDate: {
          lte: new Date(endDate),
        },
      });
    }

    if (categories && categories.length > 0) {
      const categoriesNumber =
        typeof categories === 'string'
          ? [Number(categories)]
          : categories.map(Number);
      conditions.push({
        invoiceCategory: {
          some: {
            category: {
              id: { in: categoriesNumber },
            },
          },
        },
      });
    }

    return this.prismaService.invoice.findMany({
      where: {
        AND: conditions,
      },
      include: {
        invoiceCategory: {
          include: {
            category: true,
          },
        },
      },
    });
  }
}
