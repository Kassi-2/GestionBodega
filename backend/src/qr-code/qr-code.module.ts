import { Module } from '@nestjs/common';
import { QrCodeController } from './qr-code.controller';
import { QrCodeService } from './qr-code.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [QrCodeController],
  providers: [
    QrCodeService,
    AuthGuard,
    {
      provide: 'MAIL_TRANSPORTER',
      useFactory: (configService: ConfigService) => {
        return nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          auth: {
            user: 'apikey',
            pass: configService.get<string>('API_KEY'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'JWT_SECRET2',
      useFactory: (configService: ConfigService) => configService.get<string>('JWT_SECRET2'),
      inject: [ConfigService],
    },
  ],
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
  exports: ['MAIL_TRANSPORTER', 'JWT_SECRET2'],
})
export class QrCodeModule {}

