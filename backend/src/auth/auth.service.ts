import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject('MAIL_TRANSPORTER')
    private readonly transporter: nodemailer.Transporter,
  ) {}

  // Iniciar sesión para un usuario existente
  // Valida el nombre de usuario y la contraseña, generando un token JWT si son correctos
  // Devuelve un objeto con el token de acceso
  public async login(user: LoginDTO) {
    try {
      const existUser = await this.prismaService.user.findUnique({
        where: { username: user.username },
      });
      if (!existUser) {
        throw new BadRequestException('Usuario o contraseña invalidos');
      }

      const isMatch = await bcrypt.compare(user.password, existUser.password);

      if (!isMatch) {
        throw new BadRequestException('Constraseña no valida');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithOutPassword } = existUser;
      const payload = {
        ...userWithOutPassword,
      };
      const access_token = await this.jwtService.signAsync(payload);
      return { access_token };
    } catch (error) {
      throw error;
    }
  }

  // Registrar un nuevo usuario en el sistema
  // Hashea la contraseña y guarda los datos en la base de datos
  // Devuelve una promesa que contiene los datos del usuario registrado
  public async register(newUser: RegisterDTO) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(newUser.password, saltOrRounds);

    const user = this.prismaService.user.create({
      data: {
        mail: newUser.mail,
        username: newUser.username,
        password: hash,
      },
    });
    return user;
  }

  public async requestPasswordReset(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { mail: email },
    });

    if (!user) {
      throw new BadRequestException('Correo no registrado');
    }

    const resetToken = await this.jwtService.signAsync(
      { userId: user.id },
      { expiresIn: '1h' }, // Token válido por 1 hora
    );

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: new Date(Date.now() + 3600000),
      },
    });

    const resetLink = `http://localhost/bodega/reset-password/${resetToken}`;
    console.log(resetLink);
    await this.transporter.sendMail({
      from: 'spam.panol.mecanica@gmail.com',
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
    });

    return { message: 'Correo de recuperación enviado' };
  }

  public async verifyCode(code: string) {
    const user = await this.prismaService.user.findFirst({
      where: { resetPasswordToken: code },
    });

    if (!user) {
      throw new BadRequestException('Enlace no válido');
    }

    if (user.resetPasswordToken !== code) {
      throw new BadRequestException('Enlace no válido');
    }

    return { message: 'Enlace válido' };
  }

  public async resetPassword(token: string, newPassword: string) {
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado', error);
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.resetPasswordToken !== token) {
      throw new BadRequestException('Token no válido');
    }

    if (new Date() > new Date(user.resetPasswordExpires)) {
      throw new BadRequestException('Token expirado');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { message: 'Contraseña restablecida correctamente' };
  }
}
