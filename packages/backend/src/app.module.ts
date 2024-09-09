import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { HealthModule } from "./healthcheck/health.module";

import "dotenv/config";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    HealthModule,
    UserModule,
    TypegooseModule.forRoot(process.env.MONGODB_URI),
  ],
})
export class AppModule {}
