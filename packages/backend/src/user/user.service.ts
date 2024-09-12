import { InjectModel } from "@m8a/nestjs-typegoose";
import { Injectable } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { MongoError } from "mongodb";
import { EntityAlreadyExists } from "../common/exception/db/EntityAlreadyExists.exception";
import { UserDto } from "./user.dto";
import { User } from "./user.model";

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

  async create(userDto: UserDto): Promise<void> {
    try {
      await this.userModel.create(userDto.toUser());
    } catch (e: unknown) {
      if ((e as MongoError)?.code == 11000) {
        throw new EntityAlreadyExists();
      }

      throw e;
    }
  }
}
