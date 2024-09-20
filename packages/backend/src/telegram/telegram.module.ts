import { Module } from "@nestjs/common";
import { TelegramInitDataValid } from "./init-data/telegram-init-data-constraint";
import { TelegramInitDataPipeTransform } from "./init-data/telegram-init-data-transform.pipe";

@Module({
  providers: [TelegramInitDataPipeTransform, TelegramInitDataValid],
  exports: [TelegramInitDataPipeTransform, TelegramInitDataValid],
})
export class TelegramModule {}
