import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { HealthService } from "./health.service";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();
  });

  describe("GET /health", () => {
    it("should return minimal information to know the application is healthy", () => {
      const version = faker.string.alphanumeric(16);
      process.env.APP_VERSION = version;
      const healthController = app.get(HealthController);

      const health = healthController.health();

      expect(health).toMatchObject({
        status: "OK",
        version: version,
      });
    });
  });
});
