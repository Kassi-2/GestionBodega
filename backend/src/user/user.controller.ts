import { Controller, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('get')
  @HttpCode(HttpStatus.OK)
  public async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
