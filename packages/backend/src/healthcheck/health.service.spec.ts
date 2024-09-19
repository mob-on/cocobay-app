import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { Feature } from "@config/features";
import { FeatureService } from "src/common/feature-flags/feature-flag.service";
import {
  MockFeatureService,
  mockFeatureService,
} from "test/fixtures/config/mock-feature";
import { HealthService } from "./health.service";

describe("HealthService", () => {
  let app: TestingModule;
  let healthService: HealthService;
  let featureService: MockFeatureService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [HealthService, mockFeatureService()],
    }).compile();

    healthService = app.get(HealthService);
    featureService = app.get(FeatureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getHealth", () => {
    it("should return minimal information to know the application is healthy", () => {
      const version = faker.string.alphanumeric(16);
      process.env.APP_VERSION = version;
      const buildTime = new Date().toISOString();
      process.env.BUILD_TIME = buildTime;

      const health = healthService.getHealth();

      expect(health).toMatchObject({
        status: "OK",
        build: {
          version: version,
        },
      });
    });

    it("should return config settings when devmode is enabled", () => {
      featureService.setFeature(Feature.DEV_MODE, true);

      const health = healthService.getHealth();

      expect(health).toMatchObject({
        status: "OK",
        config: expect.any(Object),
      });
    });

    it("should NOT return sensitive settings when devmode is not enabled", () => {
      featureService.setFeature(Feature.DEV_MODE, false);
      const version = faker.string.alphanumeric(16);
      process.env.APP_VERSION = version;
      const buildTime = new Date().toISOString();
      process.env.BUILD_TIME = buildTime;

      const health = healthService.getHealth();

      expect(health).not.toMatchObject({
        status: "OK",
        build: {
          date: buildTime,
        },
        config: expect.any(Object),
      });
    });
  });
});
