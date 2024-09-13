import { Injectable } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { MongoError } from "mongodb";
import { ExceptionMapper } from "../exception-mapper";

@Injectable()
export class MongoExceptionMapper extends ExceptionMapper {
  isUniqueKeyViolation(e: unknown) {
    return (e as MongoError)?.code == 11000;
  }
  isValidationFailure(e: unknown) {
    return e instanceof ValidationError;
  }
}
