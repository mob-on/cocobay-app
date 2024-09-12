import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { configureMainApiNestApp } from "./main-api-bootstrap-config";

async function bootstrap() {
  const logger = new Logger("Main");
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT, 10) || 3001;

  configureMainApiNestApp(app);

  const server = app.listen(port);
  logger.log(`Application started on port ${port}`);
  await server;
}
bootstrap();
