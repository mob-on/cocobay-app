import { InjectModel } from "@m8a/nestjs-typegoose";
import { Injectable } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { ExceptionMapper } from "src/common/database/exception-mapper";
import { UniqueViolation } from "src/common/exception/db/unique-violation.exception";
import { MinimalUser, User } from "../model/user.model";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
    private readonly exceptionMapper: ExceptionMapper,
  ) {}

  /**
   * Finds a user by their ID.
   *
   * @param id - The ID of the user to find.
   * @returns A promise that resolves to the found user.
   */
  async findById(id: string): Promise<User> {
    return await this.userModel
      .findOne({
        id,
      })
      .exec();
  }

  /**
   * Creates a new user.
   *
   * @param user - The user object to be created.
   * @returns A promise that resolves to the created user.
   * @throws {UniqueViolation} If there is a unique key violation.
   */
  async create(user: MinimalUser): Promise<User> {
    try {
      return (await this.userModel.create(user)).save();
    } catch (e: unknown) {
      if (this.exceptionMapper.isUniqueKeyViolation(e)) {
        throw new UniqueViolation();
      }

      throw e;
    }
  }
}
