// src/work-hours/work-hours.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { WorkHoursService } from './work-hours.service';
import { WorkHours } from './schemas/work-hours/work-hours';
import { CreateWorkHoursDto } from './dto/create-work-hours.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('Horas')
@Controller('work-hours')
@UseGuards(JwtAuthGuard)
export class WorkHoursController {
  constructor(
    private readonly workHoursService: WorkHoursService,
    private readonly authService: AuthService,
  ) {}

  // Função que calcula a duração entre dois horários em horas
  private calculateDuration(startTime: string, endTime: string): number {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    // Cria os objetos Date para os horários
    const startDate = new Date();
    const endDate = new Date();

    startDate.setHours(startHours, startMinutes, 0); // Define horas e minutos para startDate
    endDate.setHours(endHours, endMinutes, 0); // Define horas e minutos para endDate

    // Calcula a diferença em milissegundos e converte para horas
    const durationInMilliseconds = endDate.getTime() - startDate.getTime();
    const durationInHours = durationInMilliseconds / (1000 * 60 * 60); // Converte milissegundos para horas

    return durationInHours;
  }

  // Função que converte um número decimal de horas para o formato HH:mm
  private formatHoursToHHMM(decimalHours: number): string {
    const hours = Math.floor(decimalHours); // Parte inteira representa as horas
    const minutes = Math.round((decimalHours - hours) * 60); // Parte fracionária convertida em minutos

    // Formatando para duas casas decimais (com zero à esquerda se necessário)
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }

  @Post()
  async createOrUpdateWorkHours(
    @Body() workHoursDto: CreateWorkHoursDto,
    @Req() req: any,
  ) {
    const userId = this.authService.extractUserIdFromToken(
      req.headers.authorization.split(' ')[1],
    );

    return this.workHoursService.createOrUpdate(workHoursDto, userId);
  }

  @Put(':date')
  async updateWorkHoursByDate(
    @Param('date') date: Date,
    @Body() updateWorkHoursDto: any,
    @Req() req: any,
  ) {
    const userId = this.authService.extractUserIdFromToken(
      req.headers.authorization.split(' ')[1],
    );
    let morningHours = null;
    let afternoonHours = null;
    if (updateWorkHoursDto.morningEnd) {
      morningHours = this.calculateDuration(
        updateWorkHoursDto.morningStart,
        updateWorkHoursDto.morningEnd,
      );
    }
    if (updateWorkHoursDto.afternoonEnd) {
      afternoonHours = this.calculateDuration(
        updateWorkHoursDto.afternoonStart,
        updateWorkHoursDto.afternoonEnd,
      );
    }

    let totalHoursFormatted = '';
    if (morningHours && afternoonHours) {
      // Soma os intervalos para obter o total de horas trabalhadas
      const totalHours = morningHours + afternoonHours;

      // Converte o total de horas para o formato HH:mm
      totalHoursFormatted = this.formatHoursToHHMM(totalHours);
    }

    const workHoursDtoAux = {
      ...updateWorkHoursDto,
      total: totalHoursFormatted ? totalHoursFormatted : '',
    };
    return this.workHoursService.updateByDate(
      new Date(date),
      workHoursDtoAux,
      userId,
    );
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<WorkHours[]> {
    const userId = this.authService.extractUserIdFromToken(
      req.headers.authorization.split(' ')[1],
    );
    return this.workHoursService.findAll(userId, startDate, endDate);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any): Promise<WorkHours> {
    const userId = this.authService.extractUserIdFromToken(
      req.headers.authorization.split(' ')[1],
    );
    return this.workHoursService.findOne(id, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any): Promise<any> {
    const userId = this.authService.extractUserIdFromToken(
      req.headers.authorization.split(' ')[1],
    );
    return this.workHoursService.remove(id, userId);
  }
}
