import { Controller, Post, UseInterceptors, UploadedFile, Body, BadRequestException, Param, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {
      purchaseOrderNumber: string;
      shipmentDate: string;
      categoryId: string; 
      registrationDate?: string;
    }
  ) {
    if (!file) {
      throw new BadRequestException('Debe proporcionar un archivo');
    }

    const categoryId = parseInt(body.categoryId, 10); 

    if (isNaN(categoryId)) {
      throw new BadRequestException('categoryId debe ser un número válido');
    }

    const result = await this.invoiceService.processAndUploadFile(
      file,
      body.purchaseOrderNumber,
      body.shipmentDate,
      categoryId,
      body.registrationDate
    );

    return result;
  }

  @Put('update/:id')
  async updateInvoice(
    @Param('id') id: number, 
    @Body() body: {
      purchaseOrderNumber: string;
      shipmentDate: string;
      registrationDate: string;
      fileUrl: string;
      categoryId: string;
    }
  ) {
    const categoryId = parseInt(body.categoryId, 10);

    const result = await this.invoiceService.updateInvoice(
      id,
      body.purchaseOrderNumber,
      body.shipmentDate,
      body.registrationDate,
      body.fileUrl,
      categoryId,
    );

    return result;
  }
}
