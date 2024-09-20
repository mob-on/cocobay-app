import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ExtractJwt } from "passport-jwt";
import { ConfigSecrets } from "@config/configuration";
import { LoggedInUser } from "./user-data";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify<LoggedInUser>(token, {
        secret: this.configService.get<ConfigSecrets>("secrets").jwtSecret,
      });
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
