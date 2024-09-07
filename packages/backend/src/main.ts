import { Logger, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("Main");
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT, 10) || 3001;

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });
  app.enableCors();

  const server = app.listen(port);
  logger.log(`Application started on port ${port}`);
  await server;
}
bootstrap();
