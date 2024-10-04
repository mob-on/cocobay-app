import {
  DynamicModule,
  INestApplication,
  Type,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import * as cookieParser from "cookie-parser";
import { Application as ExpressApplication } from "express";
import { CorsSettings } from "@config/configuration";

export const getCorsOrigin = (config: ConfigService) => {
  const corsSettings = config.get<CorsSettings>("cors");

  let corsSettingEnabled = null;
  for (const [key, setting] of Object.entries(corsSettings)) {
    if (typeof setting !== undefined) {
      if (corsSettingEnabled !== null) {
        throw new Error("Only one CORS setting can be defined, found multiple");
      }

      if (key.endsWith("RegExp")) {
        if (setting instanceof Array) {
          corsSettingEnabled = setting.map((origin) => RegExp(origin));
        } else {
          corsSettingEnabled = RegExp(setting);
        }
      } else {
        corsSettingEnabled = setting;
      }
    }
  }

  if (corsSettingEnabled === null) {
    throw new Error("No CORS setting defined");
  }
  if (corsSettingEnabled === false) {
    throw new Error("CORS value 'false' is not allowed");
  }

  return corsSettingEnabled;
};

export const configureMainApiNestApp = <T>(
  app: INestApplication,
  mainModule: DynamicModule | Type<T>,
) => {
  const expressApp = app.getHttpAdapter() as unknown as ExpressApplication;

  expressApp.disable("x-powered-by");

  useContainer(app.select(mainModule), { fallbackOnErrors: true });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "v",
    defaultVersion: "1",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      validateCustomDecorators: true,
    }),
  );

  app.use(cookieParser());
  app.enableCors({
    origin: getCorsOrigin(app.get(ConfigService)),
    credentials: true,
  });

  return app;
};
