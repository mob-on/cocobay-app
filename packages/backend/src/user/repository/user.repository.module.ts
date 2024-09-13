import { TypegooseModule } from "@m8a/nestjs-typegoose";
import { Module } from "@nestjs/common";
import { ExceptionMapper } from "src/common/database/exception-mapper";
import { MongoExceptionMapper } from "src/common/database/mongodb/mongo-exception-mapping";
import { User } from "../model/user.model";
import { UserRepository } from "./user.repository";

@Module({
  imports: [TypegooseModule.forFeature([User])],
  providers: [
    UserRepository,
    {
      provide: ExceptionMapper,
      useClass: MongoExceptionMapper,
    },
  ],
})
export class UserRepositoryModule {}
