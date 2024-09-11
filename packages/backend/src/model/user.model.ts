import { prop } from "@typegoose/typegoose";
import { IsPositive, IsString } from "class-validator";

export class User {
  @prop({ required: true, index: true, unique: true })
  @IsPositive()
  id: number;

  @IsString()
  firstName: string;

  @IsString()
  username: string;

  @IsString()
  languageCode: string;
}
