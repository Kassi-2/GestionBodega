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
    categoryIds: string[];  
    registrationDate?: string;
  }
) {
  if (!file) {
    throw new BadRequestException('Debe proporcionar un archivo');
  }

  const categoryIds = body.categoryIds.map((categoryId) => parseInt(categoryId, 10));

  if (categoryIds.some(isNaN)) {
    throw new BadRequestException('categoryIds deben ser números válidos');
  }
  const result = await this.invoiceService.processAndUploadFile(
    file,
    body.purchaseOrderNumber,
    body.shipmentDate,
    categoryIds,  
    body.registrationDate
  );

  return result;
}


  @Put('update/:id')
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
async updateInvoice(
  @Param('id') id: string, 
  @Body() body: {
    purchaseOrderNumber?: string;
    shipmentDate?: string;
    registrationDate?: string;
    categoryIds?: string[]; 
  },
  @UploadedFile() file: Express.Multer.File, 
) {
  const parsedId = parseInt(id, 10); 
  if (isNaN(parsedId)) {
    throw new BadRequestException('El ID debe ser un número válido');
  }

  const categoryIds = body.categoryIds
    ? body.categoryIds.map((categoryId) => parseInt(categoryId, 10)) 
    : undefined;

  if (categoryIds && categoryIds.some((categoryId) => isNaN(categoryId))) {
    throw new BadRequestException('categoryIds deben ser números válidos');
  }

  const result = await this.invoiceService.updateInvoice(
    parsedId,
    body.purchaseOrderNumber,
    body.shipmentDate,
    body.registrationDate,
    file, 
    categoryIds, 
  );

  return result;
}
}