import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { UniqueViolation } from "../../common/exception/db/unique-violation.exception";
import { UserDto } from "../dto/user.dto";
import { UserService } from "../service/user.service";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:id")
  async getUser(@Param("id") id: number) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  @Post()
  @HttpCode(201)
  async createUser(@Param("id") id: number, @Body() userDto: UserDto) {
    try {
      return await this.userService.create(userDto);
    } catch (e: unknown) {
      if (e instanceof UniqueViolation) {
        throw new BadRequestException(e, "Unable to create user");
      }

      throw e;
    }
  }
}
