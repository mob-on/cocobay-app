import { InjectModel } from "@m8a/nestjs-typegoose";
import { Injectable } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { ExceptionMapper } from "src/common/database/exception-mapper";
import { UniqueViolation } from "src/common/exception/db/unique-violation.exception";
import { User } from "../model/user.model";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
    private readonly exception: ExceptionMapper,
  ) {}

  async findById(id: string): Promise<User> {
    return await this.userModel.findOne({
      id,
    });
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      return (await this.userModel.create(user)).save();
    } catch (e: unknown) {
      if (this.exception.isUniqueKeyViolation(e)) {
        throw new UniqueViolation();
      }

      throw e;
    }
  }
}
