import { Module } from "@nestjs/common";
import { UserController } from "./controller/user.controller";
import { UserRepositoryModule } from "./repository/user.repository.module";
import { UserService } from "./service/user.service";

@Module({
  imports: [UserRepositoryModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
