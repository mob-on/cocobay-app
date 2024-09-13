import { Injectable } from "@nestjs/common";
import { EntityNotFoundException } from "src/common/exception/db/entity-not-found.exception";
import { UniqueViolation } from "src/common/exception/db/unique-violation.exception";
import { DuplicateEntityException } from "src/common/exception/service/duplicate-user.exception";
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
   * Creates a new user in the repository.
   *
   * @param userDto - The data transfer object containing user information.
   * @returns A promise that resolves to the created UserDto.
   * @throws DuplicateUserException - If a user with the same unique identifier already exists.
   * @throws Error - If any other error occurs during the creation process.
   */
  async create(userDto: UserDto): Promise<UserDto> {
    try {
      return UserDto.fromUser(
        await this.userRepository.create(UserDto.toUser(userDto)),
      );
    } catch (e: unknown) {
      if (e instanceof UniqueViolation) {
        throw new DuplicateEntityException(e.message);
      }

      throw e;
    }
  }
}
