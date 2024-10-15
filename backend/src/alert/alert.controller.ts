import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertCreateDTO } from './dto/alert-create.dto';

@Controller('alerts')
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAllAlerts() {
    return await this.alertService.getAllAlerts();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createAlert(@Body() request: AlertCreateDTO) {
    return await this.alertService.createAlert(request);
  }

  @Get('/hello')
  @HttpCode(HttpStatus.OK)
  public getHello() {
    return 'hello world';
  }
}
