import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Param,
  Put,
  Get,
  ParseIntPipe,
  Delete,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { InvoiceService } from './invoice.service';
import { Response } from 'express';
import { InvoiceFilterDTO } from './dto/invoice-filter.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  public async findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.findOne(id);
  }

  @Delete(':id')
  public async remove(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.remove(id);
  }

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
    @Body()
    body: {
      purchaseOrderNumber: string;
      shipmentDate: string;
      categoryIds: string;
      registrationDate?: string;
    },
  ) {
    if (!file) {
      throw new BadRequestException('Debe proporcionar un archivo');
    }

    let categoryIds: number[];
    try {
      categoryIds = JSON.parse(body.categoryIds).map((categoryId: string) =>
        parseInt(categoryId, 10),
      );
    } catch (error) {
      throw new BadRequestException('categoryIds debe ser un array válido');
    }

    if (categoryIds.some(isNaN)) {
      throw new BadRequestException('categoryIds deben ser números válidos');
    }
    const result = await this.invoiceService.processAndUploadFile(
      file,
      body.purchaseOrderNumber,
      body.shipmentDate,
      categoryIds,
      body.registrationDate,
    );

    return result;
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any, 
    @UploadedFile() file?: Express.Multer.File, 
  ) {
    try {
      console.log('ID recibido:', id);
      console.log('Cuerpo recibido:', body);
      console.log('Archivo recibido:', file);

      let categoryIds: number[] = [];
      if (body.categoryIds) {
        try {
          categoryIds = JSON.parse(body.categoryIds);
        } catch (error) {
          throw new BadRequestException(
            'El formato de categoryIds no es válido. Debe ser un arreglo de números.',
          );
        }
      }

      return await this.invoiceService.updateInvoice(
        id,
        body.purchaseOrderNumber,
        body.shipmentDate,
        body.registrationDate,
        file,
        categoryIds,
      );
    } catch (error) {
      console.error('Error al actualizar la factura:', error.message);
      throw error;
    }
  }

  @Get('download/:id')
  public async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const { stream, fileName } = await this.invoiceService.getInvoiceFile(id);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );
      res.setHeader('Content-Type', 'application/pdf');

      stream.pipe(res);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'No se pudo descargar el archivo',
      });
    }
  }

  @Get('filter/filter')
  public async filterInvoices(
    @Query()
    filters: InvoiceFilterDTO,
  ) {
    return await this.invoiceService.filterInvoices(filters);
  }
}
