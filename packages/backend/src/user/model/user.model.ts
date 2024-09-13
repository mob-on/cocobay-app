import { prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class User extends TimeStamps {
  @prop({ required: true, index: true, unique: true })
  id: string;

  @prop()
  firstName: string;

  @prop()
  username: string;

  @prop()
  languageCode: string;
}
