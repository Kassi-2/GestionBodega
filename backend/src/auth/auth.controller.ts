import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() request: RegisterDTO) {
    return await this.authService.register(request);
  }

  @Post('/login')
  @HttpCode(HttpStatus.CREATED)
  public async login(@Body() request: LoginDTO) {
    return await this.authService.login(request);
  }

  @Post('/request-password-reset')
  public async requestPasswordReset(@Body('mail') mail: string) {
    return this.authService.requestPasswordReset(mail);
  }

  @Post('/reset-password')
  public async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  @Post('/verify-code')
  public async verifyCode(@Body('token') token: string) {
    return this.authService.verifyCode(token);
  }
}
