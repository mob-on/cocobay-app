import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { InitDataParsed, parse } from "@telegram-apps/init-data-node";
import { TelegramWebappAuthDtoValid } from "./valid-init-data.dto";

@Injectable()
export class TelegramInitDataPipeTransform
  implements PipeTransform<TelegramWebappAuthDtoValid, InitDataParsed>
{
  constructor() {}

  transform(
    dto: TelegramWebappAuthDtoValid,
    _metadata?: ArgumentMetadata,
  ): InitDataParsed {
    try {
      return parse(dto.initDataRaw);
    } catch (e: unknown) {
      throw new Error("Unexpected or malformed initData");
    }
  }
}
