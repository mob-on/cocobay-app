import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sign } from "jsonwebtoken";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async signIn(userId: string) {
    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return sign({ userId }, this.configService.get<string>("jwtSecret"), {
      expiresIn: "1m",
    });
  }
}
