import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ enum: ['m', 'f'], required: true })
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({age: 1})