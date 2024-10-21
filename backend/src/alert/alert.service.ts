import { BadRequestException, Injectable } from '@nestjs/common';
import { LendingState } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlertCreateDTO } from './dto/alert-create.dto';

@Injectable()
export class AlertService {
  constructor(private prismaService: PrismaService) {}

  public async getAllAlerts() {
    return this.prismaService.alert.findMany({
      orderBy: { date: 'desc' },
      take: 30,
    });
  }

  public async createAlert(newAlert: AlertCreateDTO) {
    try {
      const alertDate = new Date(newAlert.date);
      alertDate.setHours(alertDate.getHours() - 3);
      const existAlert = await this.prismaService.alert.findFirst({
        where: { date: alertDate },
      });
      if (!existAlert) {
        const activeLendings = await this.prismaService.lending.findMany({
          where: { state: LendingState.Active },
        });
        const amount = await this.prismaService.lending.count({
          where: { state: LendingState.Active },
        });
        const description = `El día ${alertDate.getDate()}-${alertDate.getMonth() + 1}-${alertDate.getFullYear()} hubieron ${amount} prestamos sin devolver`;
        const createdAlert = this.prismaService.alert.create({
          data: {
            date: alertDate,
            name: newAlert.name,
            description: description,
            state: newAlert.state,
            lendings: {
              create: activeLendings.map((lending) => ({
                lendingId: lending.id,
              })),
            },
          },
        });
        return createdAlert;
      } else {
        return existAlert;
      }
    } catch (error) {
      throw error;
    }
  }

  public async markAlertAsViewed(alertId: number) {
    try {
      const existAlert = await this.prismaService.alert.findUnique({
        where: { id: alertId },
      });
      if (!existAlert) {
        throw new BadRequestException('La alerta que se intenta ver no existe');
      }
      const updatedAlert = await this.prismaService.alert.update({
        where: { id: alertId },
        data: { state: true },
      });
      return updatedAlert;
    } catch (error) {
      throw error;
    }
  }

  public async deleteAlert(alertId: number) {
    try {
      const existAlert = await this.prismaService.alert.findUnique({
        where: { id: alertId },
      });
      if (!existAlert) {
        throw new BadRequestException(
          'La alerta que se intenta eliminar ya no existe',
        );
      }
      const deleteAlert = await this.prismaService.alert.delete({
        where: { id: alertId },
      });
      return deleteAlert;
    } catch (error) {
      throw error;
    }
  }
}
