import { prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

export class User extends TimeStamps implements Base {
  _id: Types.ObjectId;

  @prop({ required: true, index: true, unique: true })
  id: string;

  @prop()
  firstName?: string;

  @prop()
  username?: string;

  @prop()
  languageCode?: string;
}
