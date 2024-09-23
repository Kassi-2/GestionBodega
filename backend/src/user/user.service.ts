import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateDTO } from './dto/user-create.dto';
import { Borrower, UserType } from '@prisma/client';
import { UserUpdateDTO } from './dto/user-update.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  public async getAllUsers() {
    return this.prismaService.borrower.findMany();
  }

  public async getAllStudents() {
    return await this.prismaService.borrower.findMany({
      where: { state: true, type: 'Student' },
      include: { student: true },
      orderBy: { name: 'asc' },
    });
  }

  public async getAllTeachers() {
    try {
      return await this.prismaService.borrower.findMany({
        where: { state: true, type: 'Teacher' },
        include: { teacher: true },
        orderBy: { name: 'asc' },
      });
    } catch (error) {
      throw error;
    }
  }

  public async getAllAssistants() {
    try {
      return await this.prismaService.borrower.findMany({
        where: { state: true, type: 'Assistant' },
        include: { assistant: true },
        orderBy: { name: 'asc' },
      });
    } catch (error) {
      throw error;
    }
  }

  public async getUserById(id: number) {
    try {
      const existUser = await this.prismaService.borrower.findUnique({
        where: { id },
        include: {
          student: true,
          teacher: true,
          assistant: true,
        },
      });
      if (!existUser) {
        throw new BadRequestException(
          'El usuario que se intenta obetener no existe',
        );
      }
      return existUser;
    } catch (error) {
      throw error;
    }
  }

  public async getAllDegrees() {
    return this.prismaService.degree.findMany();
  }

  public async createUser(user: UserCreateDTO) {
    const existUser = await this.prismaService.borrower.findUnique({
      where: { rut: user.rut.toUpperCase() },
    });

    if (existUser) {
      if (existUser.type != user.type) {
        throw new BadRequestException(
          `Este usuario ya se encuentra registrado como tipo de usuario ${existUser.type}, si desea cambiar su tipo, debe hacerlo editando al usuario.`,
        );
      }
      await this.prismaService.borrower.update({
        where: { rut: user.rut.toUpperCase() },
        data: {
          state: true,
          rut: user.rut.toUpperCase(),
          name: user.name.toUpperCase(),
          mail: user.mail ? user.mail.toLowerCase() : undefined,
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
          rut: user.rut.toUpperCase(),
          name: user.name.toUpperCase(),
          mail: user.mail ? user.mail.toLowerCase() : undefined,
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

  public async updateUser(id: number, user: UserUpdateDTO) {
    try {
      const existUser = await this.prismaService.borrower.findUnique({
        where: { id },
      });

      if (!existUser) {
        throw new NotFoundException('El usuario no existe');
      }
      if (existUser.type != user.type && user.type != undefined) {
        switch (user.type) {
          case UserType.Student:
            if (!user.degree) {
              throw new BadRequestException(
                'Los usuarios de tipo estudiante deben tener una carrera',
              );
            }
            await this.prismaService.student.create({
              data: {
                id: existUser.id,
                codeDegree: user.degree,
              },
            });
            break;
          case UserType.Teacher:
            await this.prismaService.teacher.create({
              data: {
                id: existUser.id,
              },
            });
            break;
          case UserType.Assistant:
            if (!user.role) {
              throw new BadRequestException(
                'Los usuarios de tipo asistente deben tener un rol',
              );
            }
            await this.prismaService.assistant.create({
              data: {
                id: existUser.id,
                role: user.role,
              },
            });
            break;
        }

        switch (existUser.type) {
          case UserType.Student:
            await this.prismaService.student.delete({
              where: { id },
            });
            break;
          case UserType.Teacher:
            await this.prismaService.teacher.delete({
              where: { id },
            });
            break;
          case UserType.Assistant:
            await this.prismaService.assistant.delete({
              where: { id },
            });
        }

        const userUpdate = this.prismaService.borrower.update({
          where: { id },
          data: {
            state: true,
            rut: user.rut.toUpperCase(),
            name: user.name.toUpperCase(),
            mail: user.mail ? user.mail.toLowerCase() : undefined,
            phoneNumber: user.phoneNumber,
            type: user.type,
          },
        });
        return userUpdate;
      } else {
        if (user.degree && existUser.type === 'Student') {
          await this.prismaService.student.update({
            where: { id },
            data: { codeDegree: user.degree },
          });
        } else if (existUser.type === 'Assistant' && user.role) {
          await this.prismaService.assistant.update({
            where: { id },
            data: { role: user.role },
          });
        }
        const userUpdate = this.prismaService.borrower.update({
          where: { id },
          data: {
            state: true,
            rut: user.rut.toUpperCase(),
            name: user.name.toUpperCase(),
            mail: user.mail ? user.mail.toLowerCase() : undefined,
            phoneNumber: user.phoneNumber,
          },
        });
        return userUpdate;
      }
    } catch (error) {
      throw error;
    }
  }

  public async deleteUser(id: number) {
    try {
      const existUser = await this.prismaService.borrower.findUnique({
        where: { id },
      });
      if (!existUser) {
        throw new BadRequestException(
          'El usuario que se intenta eliminar no existe',
        );
      }
      const user = await this.prismaService.borrower.update({
        where: { id },
        data: { state: false },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async importUsers(
    type: UserType,
    degree: string | undefined,
    data: any,
  ) {
    try {
      const workbook = XLSX.read(data.buffer, { type: 'buffer' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const users = XLSX.utils.sheet_to_json(sheet);

      const processedUsers = users.map((user) => ({
        rut: user['Rut'].toUpperCase(),
        name: user['Nombre'].toUpperCase(),
        mail: user['E-mail'].toLowerCase(),
        phoneNumber: user['Fono'],
        role: user['Rol'],
      }));

      processedUsers.forEach(async (user) => {
        const existUser = await this.prismaService.borrower.findUnique({
          where: { rut: user.rut.toUpperCase() },
        });
        if (!existUser) {
          const userDTO: UserCreateDTO = {
            ...user,
            type,
            degree,
          };
          this.createUser(userDTO);
        } else {
          const id = existUser.id;
          const userUpdateDTO: UserUpdateDTO = {
            ...user,
            type,
            degree,
          };
          this.updateUser(id, userUpdateDTO);
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
