import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';  
import * as fs from 'fs';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service'; 

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService, 
  ) {}

  async processAndUploadFile(file: Express.Multer.File, purchaseOrderNumber: string, shipmentDate: string) {
    try {
      const fileContent = fs.readFileSync(file.path); 

      const fileBase64 = fileContent.toString('base64');

      const uploadResult = await this.uploadToGoogleAppsScript(fileBase64, file.mimetype, file.originalname);
      if (!uploadResult.success) {
        throw new Error('Error al intentar subir el archivo');
      }

      const updatedInvoice = await this.prisma.invoice.create({
        data: {
          purchaseOrderNumber,
          shipmentDate: new Date(shipmentDate),
          fileUrl: uploadResult.fileUrl,
        },
      });

      fs.unlinkSync(file.path);

      return updatedInvoice;
    } catch (error) {
      console.error('Error procesando el archivo:', error.message);
      throw new Error('No se pudo procesar el archivo');
    }
  }

  private async uploadToGoogleAppsScript(fileBase64: string, mimeType: string, fileName: string) {
    try {
      const form = new FormData();
      form.append('file', fileBase64); 
      form.append('mimeType', mimeType);
      form.append('fileName', fileName);

      const response = await axios.post('https://script.google.com/macros/s/AKfycby2ozFceSrD3xrrDzrzSofRjZW0XozV04Oz0ork71zJUUDRFRz51vyH11SkNYOSMMxm/exec', form, {
        headers: form.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error ejecutando Google Apps Script:', error.message);
      throw new Error('No se pudo subir el archivo');
    }
  }
}
