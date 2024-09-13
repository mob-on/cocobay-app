import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { Application as ExpressApplication } from "express";

export const configureMainApiNestApp = (app: INestApplication) => {
  const expressApp = app.getHttpAdapter() as unknown as ExpressApplication;

  expressApp.disable("x-powered-by");

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "v",
    defaultVersion: "1",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors();

  return app;
};
