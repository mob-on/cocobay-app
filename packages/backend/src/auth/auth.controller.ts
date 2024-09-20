import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { TelegramInitDataPipeTransform } from "src/telegram/init-data/telegram-init-data-transform.pipe";
import { TelegramWebappAuthDtoValid } from "src/telegram/init-data/valid-init-data.dto";
import { AuthService } from "./auth.service";

@Controller("/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly telegramInitDataTransformer: TelegramInitDataPipeTransform,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("/telegram/login")
  signIn(
    @Body()
    webappAuthDto: TelegramWebappAuthDtoValid,
  ) {
    try {
      this.telegramInitDataTransformer.transform(webappAuthDto);
      //TODO: Implement JWT token generation
    } catch (e) {
      throw new BadRequestException("Invalid initData");
    }
  }
}
