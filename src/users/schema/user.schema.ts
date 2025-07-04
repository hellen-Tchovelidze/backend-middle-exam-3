import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ enum: ['m', 'f'], required: true })
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({age: 1})