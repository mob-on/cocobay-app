import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { Feature } from "src/shared/lib/FeatureFlags";
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
      const buildTime = new Date().toISOString();
      process.env.BUILD_TIME = buildTime;
      const healthService = app.get(HealthService);

      const health = healthService.getHealth();

      expect(health).toMatchObject({
        status: "OK",
        build: {
          version: version,
        },
      });
    });

    it("should return config settings when devmode is enabled", () => {
      Feature.DEV_MODE = true;
      const healthService = app.get(HealthService);

      const health = healthService.getHealth();

      expect(health).toMatchObject({
        status: "OK",
        config: expect.any(Object),
      });
    });

    it("should NOT return sensitive settings when devmode is not enabled", () => {
      Feature.DEV_MODE = false;
      const version = faker.string.alphanumeric(16);
      process.env.APP_VERSION = version;
      const buildTime = new Date().toISOString();
      process.env.BUILD_TIME = buildTime;
      const healthService = app.get(HealthService);

      const health = healthService.getHealth();

      expect(health).not.toMatchObject({
        status: "OK",
        build: {
          date: expect.any(String),
        },
        config: expect.any(Object),
      });
    });
  });
});
