import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "@shared/src/dto/user.dto";
import { InitData } from "@telegram-apps/init-data-node";
import { EntityNotFoundException } from "src/common/exception/db/entity-not-found.exception";
import { UserService } from "src/user/service/user.service";
import { TelegramJwtDto } from "../../../shared/src/dto/auth/telegram-jwt-dto";
import { LoggedInUser } from "./logged-in-user-data";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  async logInWithTelegram(userId: string, { user }: InitData) {
    let userObj: UserDto;
    try {
      userObj = await this.userService.getUser(userId);
    } catch (e) {
      if (e instanceof EntityNotFoundException) {
        userObj = await this.userService.create({
          id: userId,
          username: user.username,
          firstName: user.firstName,
          languageCode: user.languageCode,
        });
      }
    }

    if (!userObj) {
      throw new Error("Unable to log in user");
    }

    return {
      user: userObj,
      token: this.jwtService.sign({ id: userId } as LoggedInUser, {
        secret: process.env.JWT_SECRET,
        expiresIn: `${this.config.get<number>("session.expiryMinutes")}m`,
      }),
    } as TelegramJwtDto;
  }
}
