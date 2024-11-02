import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as QRCode from 'qrcode';
import * as nodemailer from 'nodemailer'

@Injectable()
export class QrCodeService {
  constructor(private readonly prisma: PrismaService) {}

    async generateQr(rut: string): Promise<string> {
        return await QRCode.toDataURL(rut);
      }

      async generateSendQr(borrower: { rut: string; mail: string; name: string }): Promise<void> {
        const qrCodeLink = await this.generateQr(borrower.rut);
    
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: '', //email
            password: '', //contraseña
          },
        });
    
        await transporter.sendMail({
          from: '', //email
          to: borrower.mail,
          subject: 'Código QR para realizar préstamos en el pañol',
          html: `<p> ${borrower.name}, este es tu código QR para poder realizar préstamos:</p><img src="${qrCodeLink}" alt="Código QR"/>`,
        });
      }

      async sendAllQr() {
        const borrowers = await this.prisma.borrower.findMany({
          where: { state: true },
          select: { rut: true, mail: true, name: true },
        });
    
        for (const borrower of borrowers) {
          if (borrower.mail) {
            await this.generateSendQr(borrower);
          }
        }
      }

}
