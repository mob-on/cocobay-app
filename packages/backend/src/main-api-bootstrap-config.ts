import {
  DynamicModule,
  INestApplication,
  Type,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { useContainer } from "class-validator";
import * as cookieParser from "cookie-parser";
import { Application as ExpressApplication } from "express";

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
  app.enableCors();

  return app;
};
