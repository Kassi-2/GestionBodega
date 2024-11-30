import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { prismaServiceService } from 'src/prismaService/prismaService.service';
import { Invoice } from '@prismaService/client';
import * as FormData from 'form-data';
import * as fs from 'fs';
import axios from 'axios';

@Injectable()
export class InvoiceService {
  constructor(private prismaServiceService: prismaServiceService) {}

  public async findAll(): Promise<Invoice[]> {
    try {
      const invoices = await this.prismaServiceService.invoice.findMany({
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
      const invoice = await this.prismaServiceService.invoice.findUnique({
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
      const deletedInvoice = await this.prismaServiceService.invoice.update({
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

  async processAndUploadFile(
    file: Express.Multer.File,
    purchaseOrderNumber: string,
    shipmentDate: string,
    categoryIds: number[], 
    registrationDate: string
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
          throw new BadRequestException(`La categoría con ID ${categoryId} no existe`);
        }
      }
  
      const fileContent = fs.readFileSync(file.path);
      const fileBase64 = fileContent.toString('base64');
  
      const uploadResult = await this.uploadToGoogleAppsScript(
        fileBase64,
        file.mimetype,
        file.originalname
      );
  
      if (!uploadResult.success) {
        throw new Error('Error al intentar subir el archivo');
      }
  
      const newInvoice = await this.prismaService.invoice.create({
        data: {
          purchaseOrderNumber,
          shipmentDate: new Date(shipmentDate),
          registrationDate: registrationDate ? new Date(registrationDate) : new Date(),
          fileUrl: uploadResult.fileUrl,
          invoiceCategory: {
            create: categoryIds.map((categoryId) => ({
              categoryId,
            })),
          },
        },
        include: {
          invoiceCategory: true,
        },
      });
  
      fs.unlinkSync(file.path); 
      return newInvoice;
    } catch (error) {
      console.error('Error procesando el archivo:', error.message);
      throw error instanceof BadRequestException
        ? error
        : new Error('No se pudo procesar el archivo');
    }
  }

  async updateInvoice(
    id: number,
    purchaseOrderNumber?: string,
    shipmentDate?: string,
    registrationDate?: string,
    file?: Express.Multer.File,
    categoryIds?: number[],
  ) {
    try {
      const invoice = await this.prismaService.invoice.findUnique({
        where: { id },
        include: { invoiceCategory: { select: { categoryId: true } } },
      });
  
      if (!invoice) {
        throw new Error('La factura no existe');
      }
  
      if (categoryIds && categoryIds.length === 0) {
        throw new Error('Debe haber al menos una categoría asociada');
      }
  
      const existingCategoryIds = invoice.invoiceCategory.map((ic) => ic.categoryId);
  
      const categoriesToRemove = existingCategoryIds.filter(
        (categoryId) => !categoryIds?.includes(categoryId),
      );
  
      const categoriesToAdd = categoryIds?.filter((categoryId) => !existingCategoryIds.includes(categoryId));
  
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
          file.originalname,
        );
  
        if (!uploadResult.success) {
          throw new Error('Error al intentar subir el archivo');
        }
  
        fileUrl = uploadResult.fileUrl;
        fs.unlinkSync(file.path);
      }
  
      const updatedInvoice = await this.prismaService.invoice.update({
        where: { id },
        data: {
          purchaseOrderNumber,
          shipmentDate: shipmentDate ? new Date(shipmentDate) : undefined,
          registrationDate: registrationDate ? new Date(registrationDate) : undefined,
          fileUrl, 
        },
        include: { invoiceCategory: true },
      });
  
      return updatedInvoice;
    } catch (error) {
      console.error('Error actualizando la factura:', error.message);
      throw new Error('No se pudo actualizar la factura');
    }
  }
  

  private async uploadToGoogleAppsScript(
    fileBase64: string,
    mimeType: string,
    fileName: string
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
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error ejecutando Google Apps Script:', error.message);
      throw new Error('No se pudo subir el archivo');
    }
  }
}
