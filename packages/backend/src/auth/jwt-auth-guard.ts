import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { BACKEND_JWT_COOKIE_NAME } from "@shared/src/cookie/auth";
import { Request } from "express";
import { ExtractJwt } from "passport-jwt";
import { ConfigSecrets } from "@config/configuration";
import { LoggedInUser } from "./logged-in-user-data";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromExtractors([
      JwtAuthGuard.extractJwtFromCookie,
      ExtractJwt.fromAuthHeaderAsBearerToken(),
    ])(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify<LoggedInUser>(token, {
        secret: this.config.get<ConfigSecrets>("secrets").jwtSecret,
        maxAge: `${this.config.get<number>("session.expiryMinutes")}m`,
      });
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private static extractJwtFromCookie(req: Request): string | null {
    return req.cookies?.[BACKEND_JWT_COOKIE_NAME];
  }
}
