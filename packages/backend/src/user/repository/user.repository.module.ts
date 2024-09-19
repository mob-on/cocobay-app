import { TypegooseModule } from "@m8a/nestjs-typegoose";
import { Module } from "@nestjs/common";
import { MongoModule } from "src/common/database/mongodb/mongo.module";
import { User } from "../model/user.model";
import { UserRepository } from "./user.repository";

@Module({
  imports: [MongoModule, TypegooseModule.forFeature([User])],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserRepositoryModule {}
