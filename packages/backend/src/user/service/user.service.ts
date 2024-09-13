import { Injectable } from "@nestjs/common";
import { EntityNotFoundException } from "src/common/exception/db/entity-not-found.exception";
import { UniqueViolation } from "src/common/exception/db/unique-violation.exception";
import { DuplicateUserException } from "src/common/exception/service/duplicate-user.exception";
import { UserDto } from "../dto/user.dto";
import { UserRepository } from "../repository/user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new EntityNotFoundException(`User with ID ${id}`);
    }
    return UserDto.fromUser(user);
  }

  /**
   * Creates a new user.
   *
   * @param userDto - The user data transfer object.
   * @returns A promise that resolves to the created user data transfer object.
   */
  async create(userDto: UserDto): Promise<UserDto> {
    try {
      return UserDto.fromUser(
        await this.userRepository.create(userDto.toUser()),
      );
    } catch (e: unknown) {
      if (e instanceof UniqueViolation) {
        throw new DuplicateUserException(e.message);
      }

      throw e;
    }
  }
}
