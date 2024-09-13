import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { UserDto } from "./user.dto";

describe("User Validation", () => {
  let validationPipe: ValidationPipe;

  beforeEach(() => {
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  });

  it("should throw a BadRequestException for invalid DTO data", async () => {
    const invalidUserDto = {
      id: "",
      firstName: 2,
      username: ["test"],
      languageCode: { lang: "en" },
    };

    try {
      await validationPipe.transform(invalidUserDto, {
        type: "body",
        metatype: UserDto,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getResponse().message).toEqual([
        "id should not be empty",
        "firstName must be a string",
        "username must be a string",
        "languageCode must be a string",
      ]);
    }
  });
});
