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
    return this.workHoursService.updateByDate(
      new Date(date),
      updateWorkHoursDto,
      userId,
    );
  }

  @Get()
  async findAll(@Req() req: any): Promise<WorkHours[]> {
    const userId = this.authService.extractUserIdFromToken(
      req.headers.authorization.split(' ')[1],
    );
    return this.workHoursService.findAll(userId);
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
