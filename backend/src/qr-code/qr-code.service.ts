import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as QRCode from 'qrcode';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class QrCodeService {
  private readonly jwtSecret = "gestion";
  constructor(private readonly prisma: PrismaService) {}

  async generateRutToken(rut: string): Promise<string> {
    try {
      return jwt.sign({ rut }, this.jwtSecret);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // generar código QR 
  async generateQr(rut: string): Promise<string> {
    try {
      const token = await this.generateRutToken(rut);
      console.log("Token generado para el QR:", token);
  
      return await QRCode.toDataURL(token);
    } catch (error) {
      console.error("Error al generar QR para RUT:", rut, error);
      throw new Error("No se pudo generar el código QR.");
    }
  }
  

  // enviar QR al correo que aparece en la base de datos
  async generateSendQr(borrower: { rut: string; mail: string; name: string }): Promise<void> {
    try {
      const qrCodeLink = await this.generateQr(borrower.rut);

      const base64Data = qrCodeLink.replace(/^data:image\/png;base64,/, "");

      const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: "", 
        },
      });

      await transporter.sendMail({
        from: "spam.panol.mecanica@gmail.com",
        to: borrower.mail,
        subject: "Código QR para realizar préstamos en el pañol",
        html: `<p>${borrower.name}, este es tu código QR para poder realizar préstamos:</p>
               <img src="cid:qrcode" alt="Código QR" style="max-width: 200px;"/>`,
        attachments: [
          {
            filename: "qrcode.png",
            content: base64Data,
            encoding: "base64",
            cid: "qrcode"
          }
        ]
      });

      console.log(`QR enviado a: ${borrower.mail}`);
    } catch (error) {
      console.error(`Error al enviar QR a ${borrower.mail}:`, error);
    }
  }

  // función que envia el qr generado a un correo temporal que se debe proporcionar
  async sendOneMail(token: string, mail: string): Promise<void> {
    try {
        const decoded = jwt.verify(token, this.jwtSecret) as { rut: string };
        const rut = decoded.rut;

        const borrower = await this.prisma.borrower.findUnique({
            where: { rut },
        });

        const qrCodeLink = await this.generateQr(rut);

        const base64Data = qrCodeLink.replace(/^data:image\/png;base64,/, "");

        const transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          auth: {
            user: 'apikey', 
            pass: "", 
          },
        });
        await transporter.sendMail({
            from: "spam.panol.mecanica@gmail.com", 
            to: mail, 
            subject: "Código QR para realizar préstamos en el pañol",
            html: `<p>Este es tu código QR para poder realizar préstamos:</p>
                   <img src="cid:qrcode" alt="Código QR" style="max-width: 200px;"/>`,
            attachments: [
                {
                    filename: "qrcode.png",
                    content: base64Data,
                    encoding: "base64",
                    cid: "qrcode"
                }
            ]
        });

      console.log(`QR enviado a: ${mail}`,);
    } catch (error) {
      console.error(`Error al enviar QR a ${mail}:`, error);
    }
}

  // enviar código qr a todos los correos de la base de datos de borrower
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
    } catch (error) {
      console.error("Error al enviar correos:", error);
    }
  }

  async decode(token: string) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { rut: string };
      const rut = decoded.rut;
      const borrower = await this.prisma.borrower.findUnique({
        where: { rut },
      });
      return borrower;
    } catch (error) {
      throw new Error("No se pudo decodificar el token");
    }
  }

}