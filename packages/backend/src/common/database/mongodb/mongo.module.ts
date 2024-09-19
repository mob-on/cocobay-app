import { Module } from "@nestjs/common";
import { ExceptionMapper } from "../exception-mapper";
import { MongoExceptionMapper } from "./mongo-exception-mapping";

@Module({
  providers: [
    {
      provide: ExceptionMapper,
      useClass: MongoExceptionMapper,
    },
  ],
  exports: [ExceptionMapper],
})
export class MongoModule {}
