import { prop } from "@typegoose/typegoose";
import { IsString } from "class-validator";

export class User {
  @prop({ required: true, index: true })
  id: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  username: string;

  @IsString()
  languageCode: string;
}
