import { Module } from '@nestjs/common';
import { QrCodeController } from './qr-code.controller';
import { QrCodeService } from './qr-code.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
    controllers: [QrCodeController],
    providers: [QrCodeService, AuthGuard],
    imports: [PrismaModule, ConfigModule],
  })
export class QrCodeModule {}
