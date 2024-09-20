import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { validate as initDataValidate } from "@telegram-apps/init-data-node";
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@Injectable()
@ValidatorConstraint({ name: "telegramInitData", async: false })
export class TelegramInitDataValid implements ValidatorConstraintInterface {
  constructor(private readonly configService: ConfigService) {}

  validate(value: string, _validationArguments?: ValidationArguments) {
    try {
      initDataValidate(
        value,
        this.configService.get<string>("telegram.appToken"),
        {
          expiresIn: this.configService.get<number>(
            "telegram.webappDataExpirySeconds",
          ),
        },
      );

      return true;
    } catch (e: unknown) {
      return false;
    }
  }
}
