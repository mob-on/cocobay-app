import { Module } from "@nestjs/common";
import { HealthModule } from "./healthcheck/health.module";

@Module({
  imports: [HealthModule],
})
export class AppModule {}
