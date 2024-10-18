import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { LendingService } from './lending.service';
import { LendingCreateDTO } from './dto/lending-create.dto';

@Controller('lending')
export class LendingController {
    constructor(private readonly lendingService: LendingService){}
    
    @Get("lending-id/:id")
    async getLendingById(@Param('id') id: string){
        return this.lendingService.getLendingById(Number(id))
    }

    @Get("lending-create-date/:date")
    async getLendingByCreateDate(@Param('date') date: Date) {
        return this.lendingService.getLendingByCreateDate(date);
    }

    @Get("lending-finalize-date/:date")
    async getLendingByFinalizeDate(@Param('fianlizeDate') finalizeDate: Date) {
        return this.lendingService.getLendingByFinalizeDate(finalizeDate);
    }
    
    @Get("/active-lending")
    async getActive(){
        return this.lendingService.getActiveLendings()
    }
    
    @Get("/pending-lending")
    async getPending(){
        return this.lendingService.getPendingLendings()
    }

    @Get("/finalized-lending")
    async getFinalized(){
        return this.lendingService.getFinalizedLendings()
    }

    @Get("/finalized-lending-max")
    async getFinalizedMax(){
        return this.lendingService.getFinalizedLendingsMax()
    }

    @Get("/eliminated-lending")
    async getEliminated(){
        return this.lendingService.getEliminatedLendings()
    }


    @Put("/active-pending/:id")
    async updateFinalizeLending(@Param('id') id: string){
        return this.lendingService.updateActivePending(Number(id))
    }
    
    @Post()
    async createLending(@Body(ValidationPipe) request: LendingCreateDTO){
        return this.lendingService.createLending(request)
    }

    @Put("/finalize-lending/:id")
    async finalizeLending(@Param('id') id: string){
        return this.lendingService.finalizeLending(Number(id))
    }

    @Delete(':id')
    async deleteLending(@Param('id') id: string) {
        return this.lendingService.deleteLending(Number(id));
    }

}

