import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LendingService } from './lending.service';
import { LendingCreateDTO } from './dto/lending-create.dto';
import { LendingFinalizeDTO } from './dto/lending-finalize.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('lending')
export class LendingController {
  constructor(private readonly lendingService: LendingService) {}

  @Get('lending-id/:id')
  public async getLendingById(@Param('id') id: string) {
    return this.lendingService.getLendingById(Number(id));
  }
  @Get('finalized/:borrowerName')
  public async getFinalizedLendingsByBorrowerName(
    @Param('borrowerName') borrowerName: string,
  ) {
    return this.lendingService.getFinalizedLendingsByBorrowerName(borrowerName);
  }

  @Get('lending-create-date/:date')
  async getLendingByCreateDate(@Param('date') date: string) {
    return this.lendingService.getLendingByCreateDate(date);
  }

  @Get('lending-inactive-date/:date')
  async getLendingByInactiveDate(@Param('date') date: string) {
    return this.lendingService.getLendingByInactiveDate(date);
  }

  @Get('lending-finalize-date/:finalizeDate')
  async getLendingByFinalizeDate(@Param('finalizeDate') finalizeDate: string) {
    return this.lendingService.getLendingByFinalizeDate(finalizeDate);
  }

  @Get('/active-lending')
  async getActive() {
    return this.lendingService.getActiveLendings();
  }

  @Get('/pending-lending')
  async getPending() {
    return this.lendingService.getPendingLendings();
  }

  @Get('/finalized-lending')
  async getFinalized() {
    return this.lendingService.getFinalizedLendings();
  }

  @Get('/finalized-lending-max')
  async getFinalizedMax() {
    return this.lendingService.getFinalizedLendingsMax();
  }

  @Get('/eliminated-lending')
  async getEliminated() {
    return this.lendingService.getEliminatedLendings();
  }

  @Get('/product/:id')
  @HttpCode(HttpStatus.OK)
  public async getAllLendingsByProduct(
    @Param('id', ParseIntPipe) idProduct: number,
  ) {
    return await this.lendingService.getAllLendingsByProduct(idProduct);
  }

  @Put('/active-pending/:id')
  async updateFinalizeLending(@Param('id') id: string) {
    return this.lendingService.updateActivePending(Number(id));
  }

  @Post()
  async createLending(@Body(ValidationPipe) request: LendingCreateDTO) {
    return this.lendingService.createLending(request);
  }

  @Put('/finalize-lending/:id')
  async finalizeLending(
    @Param('id') id: number,
    @Body() LendingFinalizeDTO: LendingFinalizeDTO,
  ) {
    const { comments } = LendingFinalizeDTO;
    return this.lendingService.finalizeLending(Number(id), comments);
  }

  @Delete('/delete/:id')
  async deleteLending(@Param('id') id: string) {
    return this.lendingService.deleteLending(Number(id));
  }

  @Delete('/delete-permanently/:id')
  async deletePermanentlyLending(@Param('id') id: string) {
    return this.lendingService.deletePermanentlyLending(Number(id));
  }

  @Put(':id/mark-as-problematic')
  public async markAsProblematic(@Param('id', ParseIntPipe) id: number) {
    return await this.lendingService.markAsProblematic(id);
  }

  @Put(':id/unmark-as-problematic')
  public async unmarkAsProblematic(@Param('id', ParseIntPipe) id: number) {
    return await this.lendingService.unmarkAsProblematic(id);
  }
}
