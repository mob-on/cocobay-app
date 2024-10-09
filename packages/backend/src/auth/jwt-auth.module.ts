import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "./jwt-auth-guard";

@Module({
  imports: [JwtModule.register({ global: true })],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class JwtAuthModule {}
