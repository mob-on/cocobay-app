import { InjectModel } from "@m8a/nestjs-typegoose";
import { Injectable } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { UserDto } from "src/dto/user.dto";

import { User } from "src/model/user.model";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async findById(id: number): Promise<UserDto> {
    return UserDto.fromUser(
      await this.userModel
        .findOne({
          id,
        })
        .exec(),
    );
  }
}
