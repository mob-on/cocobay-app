import { TypegooseModule } from "@m8a/nestjs-typegoose";
import { Module } from "@nestjs/common";

import "dotenv/config";
import { HealthModule } from "./healthcheck/health.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    HealthModule,
    UserModule,
    TypegooseModule.forRoot(process.env.MONGODB_URI),
  ],
})
export class AppModule {}
