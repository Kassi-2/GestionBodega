import { Injectable } from '@nestjs/common';
import { LendingState } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlertCreateDTO } from './dto/alert-create.dto';

@Injectable()
export class AlertService {
  constructor(private prismaService: PrismaService) {}

  public async getAllAlerts() {
    return this.prismaService.alert.findMany();
  }

  public async createAlert(newAlert: AlertCreateDTO) {
    const activeLendings = await this.prismaService.lending.findMany({
      where: { state: LendingState.Active },
    });
    const createdAlert = this.prismaService.alert.create({
      data: {
        date: newAlert.date,
        name: newAlert.name,
        description: newAlert.description,
        state: newAlert.state,
        lendings: {
          create: activeLendings.map((lending) => ({
            lendingId: lending.id,
          })),
        },
      },
    });
    return createdAlert;
  }
}
