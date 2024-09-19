import { IsNotEmpty, Validate } from "class-validator";
import { TelegramInitDataValid } from "./telegram-init-data-constraint";

/**
 * Data Transfer Object (DTO) for validating Telegram Webapp authentication data.
 *
 * @class TelegramWebappAuthDtoValid
 *
 * @property {string} initDataRaw - The raw initialization data from Telegram.
 *
 * @decorator `@Validate` - Validates the `initDataRaw` property using the `TelegramInitDataValid` validator.
 * @decorator `@IsNotEmpty` - Ensures that the `initDataRaw` property is not empty.
 *
 * @constructor
 * @param {Partial<TelegramWebappAuthDtoValid>} [initDataRaw] - Partial object to initialize the DTO.
 *
 * @see TelegramWebappAuthDto - Front end version of this DTO, without raw data validation
 */
export class TelegramWebappAuthDtoValid {
  @Validate(TelegramInitDataValid, {
    message: "Invalid telegram init data",
  })
  @IsNotEmpty()
  initDataRaw: string;

  constructor({ initDataRaw }: Partial<TelegramWebappAuthDtoValid> = {}) {
    if (initDataRaw) this.initDataRaw = initDataRaw;
  }
}
