import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CollectRequestStatus extends Document {
  @Prop({ required: true })
  collect_id: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  payment_method: string;

  @Prop({ required: true })
  gateway: string;

  @Prop({ required: true })
  transaction_amount: number;

  @Prop()
  bank_reference: string;
}

export const CollectRequestStatusSchema = SchemaFactory.createForClass(CollectRequestStatus);
