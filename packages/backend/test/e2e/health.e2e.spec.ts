import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { HealthModule } from "../../src/healthcheck/health.module";
import * as request from "supertest";

describe("HealthController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health endpoint", () => {
    return request(app.getHttpServer()).get("/health").expect(200).expect({
      status: "OK",
    });
  });
});
