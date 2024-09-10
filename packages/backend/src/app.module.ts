import { Module } from "@nestjs/common";
import { HealthModule } from "./healthcheck/health.module";

import "dotenv/config";
import { UserModule } from "./user/user.module";
import { TypegooseModule } from "@m8a/nestjs-typegoose";

@Module({
  imports: [
    HealthModule,
    UserModule,
    TypegooseModule.forRoot(process.env.MONGODB_URI),
  ],
})
export class AppModule {}
