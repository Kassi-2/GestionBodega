import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as QRCode from 'qrcode';
import * as nodemailer from 'nodemailer'

@Injectable()
export class QrCodeService {
  constructor(private readonly prisma: PrismaService) {}

  async generateQr(rut: string): Promise<string> {
    try {
        return await QRCode.toDataURL(rut);
    } catch (error) {
        console.error("Error generating QR code:", error);
        throw new Error("Failed to generate QR code");
    }
}

async generateSendQr(borrower: { rut: string; mail: string; name: string }): Promise<void> {
    try {
        const qrCodeLink = await this.generateQr(borrower.rut);

        // Elimina el prefijo "data:image/png;base64," para usar solo el contenido de base64
        const base64Data = qrCodeLink.replace(/^data:image\/png;base64,/, "");

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '', // mail del que se va a enviar
                pass: '', // contraseña
            },
        });

        await transporter.sendMail({
            from: '', // mail del que se va a enviar
            to: borrower.mail,
            subject: 'Código QR para realizar préstamos en el pañol',
            html: `<p>${borrower.name}, este es tu código QR para poder realizar préstamos:</p>
                   <img src="cid:qrcode" alt="Código QR" style="max-width: 200px;"/>`,
            attachments: [
                {
                    filename: 'qrcode.png',
                    content: base64Data,
                    encoding: 'base64',
                    cid: 'qrcode'
                }
            ]
        });

        console.log(`QR enviado a: ${borrower.mail}`);
    } catch (error) {
        console.error(`Error al enviar QR a ${borrower.mail}:`, error);
    }
}


async sendAllQr() {
  try {
      const borrowers = await this.prisma.borrower.findMany({
          where: { state: true }, 
          select: { rut: true, mail: true, name: true },
      });

      for (const borrower of borrowers) {
          if (borrower.mail) {
              await this.generateSendQr(borrower);
          }
      }

      console.log("Todos los correos enviados a los borrowers con estado true.");
  } catch (error) {
      console.error("Error al enviar correos:", error);
  }
}

}
