import { TypegooseModule } from "@m8a/nestjs-typegoose";
import { Module } from "@nestjs/common";

import { UserController } from "./controller/user.controller";
import { User } from "./model/user.model";
import { UserService } from "./service/user.service";

@Module({
  imports: [TypegooseModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
