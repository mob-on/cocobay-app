import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserDto } from "@shared/src/dto/user.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { EntityNotFoundException } from "src/common/exception/db/entity-not-found.exception";
import { DuplicateEntityException } from "src/common/exception/service/duplicate-user.exception";
import { UserService } from "../service/user.service";

@Controller("/user")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:id")
  async getUser(@Param("id") id: string) {
    //TODO: only allow retrieving information about my own user
    try {
      return await this.userService.getUser(id);
    } catch (e: unknown) {
      if (e instanceof EntityNotFoundException) {
        throw new NotFoundException("User not found");
      }

      throw e;
    }
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() userDto: UserDto) {
    try {
      await this.userService.create(userDto);
    } catch (e: unknown) {
      if (e instanceof DuplicateEntityException) {
        throw new BadRequestException(
          "Unable to create user, user with provided details already exists",
        );
      }

      throw e;
    }
  }
}
