import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { MongoError } from "mongodb";
import { UserDto } from "src/dto/user.dto";
import { UserService } from "./user.service";

@Controller("/user")
export class UserController {
  private logger = new Logger(UserController.name);

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
      await this.userService.create(userDto);
    } catch (e: unknown) {
      if ((e as MongoError)?.code === 11000) {
        throw new BadRequestException(e, "Unable to create user");
      }

      this.logger.error("Unexpected error when creating user", e);
      throw new InternalServerErrorException(e, "Unable to create user");
    }
  }
}
