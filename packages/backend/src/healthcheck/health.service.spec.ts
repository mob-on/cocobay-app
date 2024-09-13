import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { HealthService } from "./health.service";

describe("HealthService", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();
  });

  describe("getHealth", () => {
    it("should return minimal information to know the application is healthy", () => {
      const version = faker.string.alphanumeric(16);
      process.env.APP_VERSION = version;
      const healthService = app.get(HealthService);

      const health = healthService.getHealth();

      expect(health).toMatchObject({
        status: "OK",
        version: version,
      });
    });
  });
});
