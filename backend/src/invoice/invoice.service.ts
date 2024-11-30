import { Injectable, BadRequestException } from '@nestjs/common';
import * as FormData from 'form-data';
import * as fs from 'fs';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async processAndUploadFile(
    file: Express.Multer.File,
    purchaseOrderNumber: string,
    shipmentDate: string,
    categoryId: number,
    registrationDate: string 
  ) {
    try {

      const existingInvoice = await this.prisma.invoice.findUnique({
        where: { purchaseOrderNumber },
      });

      if (existingInvoice) {
        throw new BadRequestException('El número de orden de compra ya existe');
      }

      const existingCategory = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!existingCategory) {
        throw new BadRequestException('La categoría especificada no existe');
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

      const updatedInvoice = await this.prisma.invoice.create({
        data: {
          purchaseOrderNumber,
          shipmentDate: new Date(shipmentDate),
          registrationDate: registrationDate ? new Date(registrationDate) : new Date(),
          fileUrl: uploadResult.fileUrl,
          invoiceCategory: {
            create: {
              categoryId,
            },
          },
        },
        include: {
          invoiceCategory: true,
        },
      });

      fs.unlinkSync(file.path);
      return updatedInvoice;
    } catch (error) {
      console.error('Error procesando el archivo:', error.message);
      throw error instanceof BadRequestException
        ? error
        : new Error('No se pudo procesar el archivo');
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

  async updateInvoice(
    id: number,
    purchaseOrderNumber: string,
    shipmentDate: string,
    registrationDate: string,
    fileUrl: string,
    categoryId: number,
  ) {
    try {
      const existingCategory = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!existingCategory) {
        throw new Error('La categoría no existe');
      }

      const updatedInvoice = await this.prisma.invoice.update({
        where: { id },
        data: {
          purchaseOrderNumber,
          shipmentDate: new Date(shipmentDate),
          registrationDate: new Date(registrationDate),
          fileUrl,
          invoiceCategory: {
            upsert: {
              where: {
                invoiceId_categoryId: {
                  invoiceId: id,
                  categoryId,
                },
              },
              update: {},
              create: {
                categoryId,
              },
            },
          },
        },
        include: {
          invoiceCategory: true,
        },
      });

      return updatedInvoice;
    } catch (error) {
      console.error('Error actualizando la factura:', error.message);
      throw new Error('No se pudo actualizar la factura');
    }
  }
}

