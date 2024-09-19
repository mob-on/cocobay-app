import { IsNotEmpty, IsString } from "class-validator";

/**
 * Data Transfer Object (DTO) for Telegram Webapp Authentication.
 *
 * This class is used to validate and transfer authentication data
 * received from a Telegram Webapp.
 *
 */
export class TelegramWebappAuthDto {
  @IsString()
  @IsNotEmpty()
  initDataRaw!: string;

  constructor({ initDataRaw }: Partial<TelegramWebappAuthDto> = {}) {
    if (initDataRaw) this.initDataRaw = initDataRaw;
  }
}
