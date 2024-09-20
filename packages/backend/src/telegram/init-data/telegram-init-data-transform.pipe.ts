import { URLSearchParams } from "url";
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { TelegramWebappAuthDtoValid } from "./valid-init-data.dto";

@Injectable()
export class TelegramInitDataPipeTransform
  implements PipeTransform<TelegramWebappAuthDtoValid, WebAppInitData>
{
  constructor() {}

  private transformUrlSearchToObject(params: URLSearchParams) {
    const initDataObj = Object.fromEntries(params);
    for (const [key, value] of Object.entries(initDataObj)) {
      try {
        initDataObj[key] = JSON.parse(decodeURIComponent(value as string));
      } catch (e) {}
    }
    return initDataObj;
  }

  transform(
    dto: TelegramWebappAuthDtoValid,
    _metadata?: ArgumentMetadata,
  ): WebAppInitData {
    try {
      return this.transformUrlSearchToObject(
        new URLSearchParams(dto.initDataRaw),
      ) as unknown as WebAppInitData;
    } catch (e: unknown) {
      throw new Error("Unexpected or malformed initData");
    }
  }
}
