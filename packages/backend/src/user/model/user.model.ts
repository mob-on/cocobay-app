import { prop } from "@typegoose/typegoose";
import { IsPositive } from "class-validator";

export class User {
  @prop({ required: true, index: true, unique: true })
  @IsPositive()
  id: number;

  @prop()
  firstName: string;

  @prop()
  username: string;

  @prop()
  languageCode: string;
}
