// src/work-hours/dto/create-work-hours.dto.ts

import { IsDateString, IsString, Matches } from 'class-validator';

export class CreateWorkHoursDto {
  @IsDateString()
  date: Date;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Invalid time format, expected HH:mm' })
  morningStart: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Invalid time format, expected HH:mm' })
  morningEnd: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Invalid time format, expected HH:mm' })
  afternoonStart: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Invalid time format, expected HH:mm' })
  afternoonEnd: string;
}
