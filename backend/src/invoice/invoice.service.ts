import { Injectable, BadRequestException } from '@nestjs/common';
import * as FormData from 'form-data';
import * as fs from 'fs';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  //agregar una factura, además se le asigna una categoría
  //se crea un archivo localmente que es eliminado al terminar de ejecutar la función
  async processAndUploadFile(
    file: Express.Multer.File,
    purchaseOrderNumber: string,
    shipmentDate: string,
    categoryIds: number[],
    registrationDate: string
  ) {
    try {
      const existingInvoice = await this.prisma.invoice.findUnique({
        where: { purchaseOrderNumber },
      });
  
      if (existingInvoice) {
        throw new BadRequestException('El número de orden de compra ya existe');
      }
  
      for (const categoryId of categoryIds) {
        const existingCategory = await this.prisma.category.findUnique({
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
        throw new BadRequestException('Error al intentar subir el archivo');
      }
  
      return await this.prisma.invoice.create({
        data: {
          purchaseOrderNumber,
          shipmentDate: new Date(shipmentDate),
          registrationDate: registrationDate ? new Date(registrationDate) : new Date(),
          fileUrl: uploadResult.fileUrl,
          invoiceCategory: {
            create: categoryIds.map((categoryId) => ({ categoryId })),
          },
        },
        include: {
          invoiceCategory: true,
        },
      });
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
      const invoice = await this.prisma.invoice.findUnique({
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
  
      const existingCategoryIds = invoice.invoiceCategory.map((ic) => ic.categoryId);
  
      const categoriesToRemove = existingCategoryIds.filter(
        (categoryId) => !categoryIds?.includes(categoryId)
      );
  
      const categoriesToAdd = categoryIds?.filter(
        (categoryId) => !existingCategoryIds.includes(categoryId)
      );
  
      if (categoriesToRemove.length > 0) {
        await this.prisma.invoiceCategory.deleteMany({
          where: {
            invoiceId: id,
            categoryId: { in: categoriesToRemove },
          },
        });
      }
  
      if (categoriesToAdd?.length > 0) {
        await this.prisma.invoiceCategory.createMany({
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
  
      return await this.prisma.invoice.update({
        where: { id },
        data: {
          purchaseOrderNumber,
          shipmentDate: shipmentDate ? new Date(shipmentDate) : undefined,
          registrationDate: registrationDate ? new Date(registrationDate) : undefined,
          fileUrl,
        },
        include: { invoiceCategory: true },
      });
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
  //sube el archivo al drive
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
