import { INestApplication, VersioningType } from "@nestjs/common";
import { Application as ExpressApplication } from "express";

export const configureMainApiNestApp = (app: INestApplication) => {
  const expressApp = app.getHttpAdapter() as any as ExpressApplication;

  expressApp.disable("x-powered-by");

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "v",
    defaultVersion: "1",
  });

  app.enableCors();

  return app;
};
