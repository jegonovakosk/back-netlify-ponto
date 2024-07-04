import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class WorkHours extends Document {
  @Prop({ required: true })
  date: Date;

  @Prop()
  morningStart: string;

  @Prop()
  morningEnd: string;

  @Prop()
  afternoonStart: string;

  @Prop()
  afternoonEnd: string;

  @Prop({ type: String, required: true })
  userId: string;
}

export const WorkHoursSchema = SchemaFactory.createForClass(WorkHours);
