import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TelegramModule } from "src/telegram/telegram.module";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthModule } from "./jwt-auth.module";

@Module({
  imports: [UserModule, JwtAuthModule, TelegramModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
