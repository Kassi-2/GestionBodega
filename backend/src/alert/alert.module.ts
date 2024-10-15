import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AlertController],
  providers: [AlertService],
  imports: [PrismaModule],
})
export class AlertModule {}
