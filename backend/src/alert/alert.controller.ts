import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AlertService } from './alert.service';

@Controller('alerts')
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAllAlerts() {
    return await this.alertService.getAllAlerts();
  }

  @Get()
  @HttpCode(HttpStatus.CREATED)
  public async createAlert() {
    return await this.createAlert();
  }
}
