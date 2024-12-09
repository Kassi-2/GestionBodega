import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AlertController],
  providers: [AlertService, AuthGuard],
  imports: [PrismaModule, ConfigModule],
})
export class AlertModule {}
