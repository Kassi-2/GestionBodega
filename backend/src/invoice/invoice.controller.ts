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
      categoryIds: string[];
      registrationDate?: string;
    },
  ) {
    if (!file) {
      throw new BadRequestException('Debe proporcionar un archivo');
    }

    const categoryIds = body.categoryIds.map((categoryId) =>
      parseInt(categoryId, 10),
    );

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
    @Body()
    body: {
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
