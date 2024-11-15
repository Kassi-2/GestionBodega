import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as QRCode from 'qrcode';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class QrCodeService {
  private readonly jwtSecret = "gestion";
  constructor(private readonly prisma: PrismaService) {}

  generateRutToken(rut: string): string {
    return jwt.sign({ rut }, this.jwtSecret);
  }

  // generar código QR 
  async generateQr(rut: string): Promise<string> {
    try {
      const token = this.generateRutToken(rut);
      return await QRCode.toDataURL(token); 
    } catch (error) {
      throw new Error("Error");
    }
  }

  // enviar QR al correo que aparece en la base de datos
  async generateSendQr(borrower: { rut: string; mail: string; name: string }): Promise<void> {
    try {
      const qrCodeLink = await this.generateQr(borrower.rut);

      const base64Data = qrCodeLink.replace(/^data:image\/png;base64,/, "");

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "", // mail del que se va a enviar
          pass: "", // contraseña
        },
      });

      await transporter.sendMail({
        from: "", // mail del que se va a enviar
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

        if (!borrower) {
            throw new Error(`No se encontró el borrower con rut: ${rut}`);
        }

        const qrCodeLink = await this.generateQr(rut);

        const base64Data = qrCodeLink.replace(/^data:image\/png;base64,/, "");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "", // mail del que se va a enviar
                pass: "", // contraseña
            },
        });
        await transporter.sendMail({
            from: "", // mail del que se va a enviar
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

      console.log(`QR enviado a: ${mail}`);
    } catch (error) {
        console.error(`Error al enviar QR a ${mail}`);
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

      if (!borrower) {
        throw new Error(`No se encontró el rut: ${rut}`);
      }
      return borrower;
    } catch (error) {
      throw new Error("No se pudo decodificar el token");
    }
  }

}
