import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CollectRequest extends Document {
  @Prop({ required: true })
  school_id: string;

  @Prop({ required: true })
  trustee_id: string;

  @Prop({ required: true })
  gateway: string;

  @Prop({ required: true })
  order_amount: number;

  @Prop({ required: true, unique: true })
  custom_order_id: string;
}


export const CollectRequestSchema = SchemaFactory.createForClass(CollectRequest);
