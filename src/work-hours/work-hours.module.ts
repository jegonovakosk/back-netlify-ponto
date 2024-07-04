// src/work-hours/work-hours.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkHoursService } from './work-hours.service';
import { WorkHoursController } from './work-hours.controller';
import { WorkHours, WorkHoursSchema } from './schemas/work-hours/work-hours';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkHours.name, schema: WorkHoursSchema },
    ]),
    AuthModule,
  ],
  controllers: [WorkHoursController],
  providers: [WorkHoursService],
})
export class WorkHoursModule {}
