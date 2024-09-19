import { Module } from "@nestjs/common";
import { TelegramModule } from "src/telegram/telegram.module";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UserModule, TelegramModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
