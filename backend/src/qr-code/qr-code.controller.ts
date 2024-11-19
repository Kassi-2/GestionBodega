import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';

@Controller('qr-code')
export class QrCodeController {
constructor(private readonly qrcodeService: QrCodeService){}

@Post('generate')
async generateQr(@Body('rut') rut: string): Promise<{ token: string }> {
    const token = await this.qrcodeService.generateRutToken(rut);
    return { token }; 
}
@Post('send')
  async generateSendQr(@Body() borrower: { rut: string; mail: string; name: string }): Promise<void> {
    await this.qrcodeService.generateSendQr(borrower);
  }

@Post('send-all')
async generateSendAllQr(): Promise<void> {
    await this.qrcodeService.sendAllQr();
}

@Get('decode')
  async decodeRut(@Query('token') token: string): Promise<{ borrower: any }> {
    try {
      const borrower = await this.qrcodeService.decode(token);
      return { borrower };
    } catch (error) {
      throw new BadRequestException("No se pudo decodificar el token");
    }
  }
@Post('temporary')
async sendOneMail(@Body() body: { token: string; mail: string }): Promise<void> {
  await this.qrcodeService.sendOneMail(body.token, body.mail);
}

}
