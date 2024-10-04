import { Module } from "@nestjs/common";
import { JwtAuthModule } from "src/auth/jwt-auth.module";
import { UserController } from "./controller/user.controller";
import { UserRepositoryModule } from "./repository/user.repository.module";
import { UserDtoMapper } from "./service/user-mapping.service";
import { UserService } from "./service/user.service";

@Module({
  imports: [UserRepositoryModule, JwtAuthModule],
  controllers: [UserController],
  providers: [UserService, UserDtoMapper],
  exports: [UserService, UserDtoMapper],
})
export class UserModule {}
