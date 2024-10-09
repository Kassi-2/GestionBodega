import { Injectable } from '@nestjs/common';
import { LendingState } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertService {
  constructor(private prismaService: PrismaService) {}

  public async getAllAlerts() {
    return this.prismaService.alert.findMany();
  }

  public async createAlert() {
    const noReturned = this.prismaService.lending.findMany({
      where: { state: LendingState.Active },
    });
    const alert = this.prismaService.alert.create({
      data: {
        date: new Date(2024, 10, 7),
        name: 'Nombre de la alerta',
        description: 'No se han devuelto x prestamos',
        state: true,
        lending: noReturned,
      },
    });
    return alert;
  }
}
