import { InjectModel } from "@m8a/nestjs-typegoose";
import { Injectable } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { MongoError } from "mongodb";
import { EntityNotFoundException } from "src/common/exception/db/EntityNotFound.exception";
import { UniqueViolation } from "src/common/exception/db/UniqueViolation.exception";
import { UserDto } from "../dto/user.dto";
import { User } from "../model/user.model";
import { UserRepository } from "../repository/user.repository";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
    private readonly userRepository: UserRepository,
  ) {}

  async getUser(id: number): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new EntityNotFoundException(`User with ID ${id}`);
    }
    return UserDto.fromUser(user);
  }

  async create(userDto: UserDto): Promise<UserDto> {
    try {
      await this.userModel.create(userDto.toUser());
    } catch (e: unknown) {
      if ((e as MongoError)?.code == 11000) {
        throw new UniqueViolation();
      }

      throw e;
    }
  }
}
