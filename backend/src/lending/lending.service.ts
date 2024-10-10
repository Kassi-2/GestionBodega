import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Lending, LendingState } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LendingController } from './lending.controller';
import { LendingCreateDTO } from './dto/lending-create.dto';
import { LendingUpdateDTO } from './dto/lending-update.dto';


@Injectable()
export class LendingService {
  constructor(private prisma: PrismaService) {}

  async getActiveLendings(): Promise<Lending[]> {
    return this.prisma.lending.findMany({
        where: {
            state: LendingState.Active,
        },
        include: {
            borrower: { 
                select: {
                  name: true,
                },
              },
              teacher: { 
                select: {
                  BorrowerId: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
        },
        orderBy: {
            date: "desc",
        },
    });
}
async getPendingLendings(): Promise<Lending[]> {
    return this.prisma.lending.findMany({
        where: {
            state: LendingState.Pending,
        },
        include: {
            borrower: { 
                select: {
                  name: true,
                },
              },
              teacher: { 
                select: {
                  BorrowerId: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
        },
        orderBy: {
            date: "desc",
        },
    });
}

async getLendingById(id: number): Promise<Lending> {
    return this.prisma.lending.findUnique({
      where: {
        id,
      },
      include: {
        lendingProducts: {  
          select: {       
            amount: true, 
            product: {
              select: {
                id: true,   
                name: true, 
                stock: true,
              },
            },
          },
        },
        borrower: {  
          select: {
            name: true,
            rut: true,
          },
        },
        teacher:{
            select: {
                BorrowerId: {
                  select: {
                    name: true,
                    rut: true,
                  },
                },
            }
        }
      },
    });
  }
  


      async getFinalizedLendings(): Promise<Lending[]> {
        return this.prisma.lending.findMany({
            where: {
                state: LendingState.Finalized,
            },
            include: {
                borrower: { 
                    select: {
                      name: true,
                    },
                  },
                  teacher: { 
                    select: {
                      BorrowerId: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
            },
            orderBy: {
                date: "desc",
            },
        });
      }

      async updateActivePending(lendingId: number):Promise<Lending>{
        const lending = await this.prisma.lending.findUnique({
            where: { id: lendingId },
        });
        if (!lending) {
            throw new NotFoundException("Ese préstamo no existe");
        }
        const updateLending = await this.prisma.lending.update({
            where: {id: lendingId},
            data: {
                state: LendingState.Active,
            },
        });
        return updateLending;
      }

      async createLending(data: LendingCreateDTO) {
        if (data.teacherId) {
            const teacher = await this.prisma.teacher.findUnique({
                where: { id: data.teacherId },
            });
    
            if (!teacher) {
                throw new Error("Ese profesor no existe"); 
            }
            }
    
        const borrower = await this.prisma.borrower.findUnique({
            where: { id: data.BorrowerId },
        });
    
        if (!borrower) {
            throw new NotFoundException("Ese prestatario no existe");
        }
    
        for (const productData of data.products) {
            const product = await this.prisma.product.findUnique({
                where: { id: productData.productId },
            });
    
            if (!product) {
                throw new NotFoundException(`El producto ${productData.productId} no existe`);
            }

            if (productData.amount > product.stock) {
                throw new BadRequestException(`La cantidad del producto ${productData.productId} solicitado excede el stock disponible)`);
            }
        }

        const lendingState = data.teacherId ? LendingState.Pending : LendingState.Active;

    const lending = await this.prisma.lending.create({
        data: {
            BorrowerId: data.BorrowerId,
            teacherId: data.teacherId,
            comments: data.comments,
            state: lendingState, 
            lendingProducts: {
                create: data.products.map((product) => ({
                    productId: product.productId,
                    amount: product.amount,
                })),
            },
        },
        include: {
            lendingProducts: {
                include: {
                    product: true,
                },
            },
        },
    });

        for (const productData of data.products) {
            await this.prisma.product.update({
                where: { id: productData.productId },
                data: {
                    stock: {
                        decrement: productData.amount,
                    },
                },
            });
        }
        return lending;
    }    

    async finalizeLending(lendingId: number): Promise<Lending>{
        const lending = await this.prisma.lending.findUnique({
            where: { id: lendingId },
            include: {
                lendingProducts: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!lending) {
            throw new NotFoundException("Préstamo no encontrado");
        }

        const updatedLending = await this.prisma.lending.update({
            where: { id: lendingId },
            data: { state: LendingState.Finalized },
        });
    
        for (const lendingProduct of lending.lendingProducts) {
            const product = lendingProduct.product;
    
            if (!product.fungible) { 
                await this.prisma.product.update({
                    where: { id: product.id },
                    data: {
                        stock: {
                            increment: lendingProduct.amount, 
                        },
                    },
                });
            }
        }
    
        return updatedLending;
    }
    async deletePending(lendingId: number):Promise<Lending>{
        const lending = await this.prisma.lending.findUnique({
            where: { id: lendingId },
        });
        if (!lending) {
            throw new NotFoundException("Ese préstamo no existe");
        }
        if (lending.state != LendingState.Finalized ) {
            throw new NotFoundException("El préstamo debe estar finalizado");
        }
        const updateLending = await this.prisma.lending.update({
            where: {id: lendingId},
            data: {
                state: LendingState.Inactive,
            },
        });
        return updateLending;
      }
    
    async updateLending(lendingId: number, data: LendingUpdateDTO):Promise<Lending>{
        const lending = await this.prisma.lending.findUnique({
            where: { id: lendingId },
        });
        if (!lending) {
            throw new NotFoundException("Ese préstamo no existe");
        }
        if (lending.state != (LendingState.Active || LendingState.Pending)) {
            throw new NotFoundException("El préstamo está finalizado, por lo que ya no se puede editar");
        }
        const updateLending = await this.prisma.lending.update({
            where: {id: lendingId},
            data,
        });
        return updateLending;

    }
    

    }
    

