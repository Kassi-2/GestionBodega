import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateDTO } from './dto/user-create.dto';
import { Borrower, UserType } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  public async getAllUsers() {
    return this.prismaService.borrower.findMany();
  }

  public async getAllStudents() {
    return await this.prismaService.borrower.findMany({
      where: { type: 'Student' },
      include: { student: true },
    });
  }

  public async getAllTeachers() {
    try {
      return await this.prismaService.borrower.findMany({
        where: { type: 'Teacher' },
        include: { teacher: true },
      });
    } catch (error) {
      throw error;
    }
  }

  public async getAllAssitants() {
    try {
      return await this.prismaService.borrower.findMany({
        where: { type: 'Assistant' },
        include: { assitant: true },
      });
    } catch (error) {
      throw error;
    }
  }

  public async getUserById() {
    return 'Usuario activo por ID';
  }

  public async getAllDegrees() {
    return this.prismaService.degree.findMany();
  }

  public async createUser(user: UserCreateDTO) {
    const existUser = await this.prismaService.borrower.findUnique({
      where: { rut: user.rut },
    });

    if (existUser) {
      if (existUser.type != user.type) {
        throw new BadRequestException(
          `Este usuario ya se encuentra registrado como tipo de usuario ${existUser.type}, si desea cambiar su tipo, debe hacerlo editando al usuario.`,
        );
      }
      await this.prismaService.borrower.update({
        where: { rut: user.rut },
        data: {
          state: true,
          rut: user.rut,
          name: user.name.toUpperCase(),
          mail: user.mail.toLowerCase(),
          phoneNumber: user.phoneNumber,
          type: user.type,
        },
      });
      switch (user.type) {
        case UserType.Student:
          await this.prismaService.student.update({
            where: { id: existUser.id },
            data: {
              codeDegree: user.degree,
            },
          });
          break;

        case UserType.Assistant:
          await this.prismaService.assistant.update({
            where: { id: existUser.id },
            data: {
              role: user.role,
            },
          });
          break;
      }
      return existUser;
    }
    switch (user.type) {
      case UserType.Student:
        if (!user.degree) {
          throw new BadRequestException(
            'Los estudiantes deben tener una carrera asignada',
          );
        }
        break;

      case UserType.Assistant:
        if (!user.role) {
          throw new BadRequestException(
            'Los asistentes deben tener un rol asignado',
          );
        }
        break;
    }

    try {
      const borrower: Borrower = await this.prismaService.borrower.create({
        data: {
          rut: user.rut,
          name: user.name.toUpperCase(),
          mail: user.mail.toLowerCase(),
          phoneNumber: user.phoneNumber,
          type: user.type,
        },
      });

      switch (user.type) {
        case UserType.Student:
          await this.prismaService.student.create({
            data: {
              id: borrower.id,
              codeDegree: user.degree,
            },
          });
          break;

        case UserType.Teacher:
          await this.prismaService.teacher.create({
            data: {
              id: borrower.id,
            },
          });
          break;

        case UserType.Assistant:
          await this.prismaService.assistant.create({
            data: {
              id: borrower.id,
              role: user.role,
            },
          });
          break;
      }

      return borrower;
    } catch (error) {
      throw error;
    }
  }

  public async updateUser() {
    return 'Usuario actualizado';
  }

  public async deleteUser() {
    return 'Usuario eliminado (cambio de estado)';
  }
}
