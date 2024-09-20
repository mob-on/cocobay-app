import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "@shared/src/dto/user.dto";
import { InitDataParsed } from "@telegram-apps/init-data-node";
import { EntityNotFoundException } from "src/common/exception/db/entity-not-found.exception";
import { UserService } from "src/user/service/user.service";
import { LoggedInUser } from "./logged-in-user-data";
import { TelegramJwtPayload } from "./telegram-jwt-payload";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async logInWithTelegram(userId: string, { user }: InitDataParsed) {
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
      }),
    } as TelegramJwtPayload;
  }
}
