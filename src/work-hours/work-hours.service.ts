import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkHours } from './schemas/work-hours/work-hours';
import { AuthService } from '../auth/auth.service'; // Importe o serviço de autenticação

@Injectable()
export class WorkHoursService {
  constructor(
    @InjectModel(WorkHours.name) private workHoursModel: Model<WorkHours>,
    private readonly authService: AuthService, // Injete o serviço de autenticação
  ) {}

  async createOrUpdate(workHoursDto: any, userId: string): Promise<WorkHours> {
    const { date, ...times } = workHoursDto;

    const existingRecord = await this.workHoursModel.findOne({ date }).exec();

    if (existingRecord) {
      Object.assign(existingRecord, { ...times, userId });
      return existingRecord.save();
    } else {
      const workHours = new this.workHoursModel({ ...workHoursDto, userId });
      return workHours.save();
    }
  }

  async updateByDate(
    date: Date,
    updateWorkHoursDto: any,
    userId: string,
  ): Promise<WorkHours> {
    // Encontra e atualiza a entrada pelo campo 'date'
    return this.workHoursModel
      .findOneAndUpdate(
        { date },
        { ...updateWorkHoursDto, userId },
        { new: true },
      )
      .exec();
  }

  async findAll(userId: string): Promise<WorkHours[]> {
    // Filtre os registros pelo userId
    return this.workHoursModel.find({ userId }).exec();
  }
  async findOne(id: string, userId: string): Promise<WorkHours> {
    const workHour = await this.workHoursModel.findById(id).exec();

    if (!workHour) {
      throw new NotFoundException('Work hour not found');
    }

    if (workHour.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to view this work hour',
      );
    }

    return workHour;
  }

  async remove(id: string, userId: string): Promise<any> {
    const workHour = await this.workHoursModel.findById(id).exec();

    if (!workHour) {
      throw new NotFoundException('Work hour not found');
    }

    if (workHour.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this work hour',
      );
    }

    return this.workHoursModel.deleteOne({ _id: id }).exec();
  }
}
