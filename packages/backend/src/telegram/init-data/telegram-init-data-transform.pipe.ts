import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { InitData, parse } from "@telegram-apps/init-data-node";
import { TelegramWebappAuthDtoValid } from "./valid-init-data.dto";

@Injectable()
export class TelegramInitDataPipeTransform
  implements PipeTransform<TelegramWebappAuthDtoValid, InitData>
{
  constructor() {}

  transform(
    dto: TelegramWebappAuthDtoValid,
    _metadata?: ArgumentMetadata,
  ): InitData {
    try {
      return parse(dto.initDataRaw);
    } catch (e: unknown) {
      throw new Error("Unexpected or malformed initData");
    }
  }
}
