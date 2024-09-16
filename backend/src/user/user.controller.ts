import {
  Controller,
  HttpStatus,
  HttpCode,
  Get,
  Post,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDTO } from './dto/user-create.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('/students')
  @HttpCode(HttpStatus.OK)
  public async getAllStudents() {
    return await this.userService.getAllStudents();
  }

  @Get('/teachers')
  @HttpCode(HttpStatus.OK)
  public async getAllTeachers() {
    return await this.userService.getAllTeachers();
  }

  @Get('/assistants')
  @HttpCode(HttpStatus.OK)
  public async getAllAssistant() {
    return await this.userService.getAllAssitants();
  }

  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  public async getUserById() {
    return await this.userService.getUserById();
  }

  @Get('/degrees')
  @HttpCode(HttpStatus.OK)
  public async getAllDegrees() {
    return await this.userService.getAllDegrees();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createUser(@Body() request: UserCreateDTO) {
    return await this.userService.createUser(request);
  }

  @Patch('/id')
  @HttpCode(HttpStatus.OK)
  public async updateUser() {
    return await this.userService.updateUser();
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  public async deleteUser() {
    return await this.userService.deleteUser();
  }
}
