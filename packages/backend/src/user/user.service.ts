import { Injectable } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import { User } from "src/model/user.model";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async findById(id: number) {
    return this.userModel
      .findOne({
        id,
      })
      .exec();
  }
}
