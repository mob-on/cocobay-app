import { faker } from "@faker-js/faker/.";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { CorsSettings } from "@config/configuration";
import {
  mockConfigProvider,
  MockConfigService,
} from "test/fixtures/config/mock-config-provider";
import { getCorsOrigin } from "./bootstrap-config";

describe("bootstrap", () => {
  let app: TestingModule;
  let config: MockConfigService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [mockConfigProvider()],
    }).compile();

    config = app.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("CORS", () => {
    it("should error if none are defined", () => {
      config.set("cors", {} as CorsSettings);

      expect(() => getCorsOrigin(config)).toThrow("No CORS setting defined");
    });

    it("should error if more than one is defined", () => {
      config.set("cors", {
        allowAllOrigins: true,
        specificOrigin: "http://localhost:3000",
      } as CorsSettings);

      expect(() => getCorsOrigin(config)).toThrow(
        "Only one CORS setting can be defined, found multiple",
      );
    });

    for (const [key, value] of Object.entries({
      allowAllOrigins: true,
      specificOrigin: `https://${faker.string.alpha()}`,
      specificOriginRegExp: "^https://.*$",
      specificOrigins: [
        faker.string.alphanumeric(),
        faker.string.alphanumeric(),
      ],
      originsString: [
        `https://${faker.string.alpha()}`,
        `https://${faker.string.alpha()}`,
      ],
      originsRegExp: ["^http://.*$", "^https://.*$"],
    } as CorsSettings)) {
      it(`should return the correct value / RegExp if ${key} is defined`, () => {
        config.set("cors", {
          [key]: value,
        } as CorsSettings);

        const isRegExp = key.endsWith("RegExp");
        const isArrayOfRegExp = isRegExp && value instanceof Array;

        let expectedResult;
        if (isArrayOfRegExp) {
          expectedResult = value.map((origin) => RegExp(origin));
        } else if (isRegExp) {
          expectedResult = RegExp(value);
        } else {
          expectedResult = value;
        }

        expect(getCorsOrigin(config)).toEqual(expectedResult);
      });
    }

    it("should error if allowAllOrigins is defined and false (CORS cannot be disabled)", () => {
      config.set("cors", {
        allowAllOrigins: false,
      } as CorsSettings);

      expect(() => getCorsOrigin(config)).toThrow(
        "CORS value 'false' is not allowed",
      );
    });
  });
});
