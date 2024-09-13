import { UniqueViolation } from "../exception/db/unique-violation.exception";

export abstract class ExceptionMapper {
  abstract isUniqueKeyViolation(e: unknown): boolean;

  uniqueKeyConstraint(e: unknown) {
    if (this.isUniqueKeyViolation(e)) {
      throw new UniqueViolation();
    }
  }

  abstract isValidationFailure(e: unknown): boolean;

  validationFailure(e: unknown) {
    if (this.isUniqueKeyViolation(e)) {
      throw new UniqueViolation();
    }
  }
}
