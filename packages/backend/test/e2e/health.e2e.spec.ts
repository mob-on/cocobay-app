import { faker } from "@faker-js/faker";
import TestAgent from "supertest/lib/agent";
import { HealthModule } from "src/healthcheck/health.module";
import { ApiSetup, setupApi } from "test/setup/setup";

describe("HealthController", () => {
  let setup: ApiSetup;
  let api: TestAgent;

  beforeAll(async () => {
    setup = await setupApi({
      imports: [HealthModule],
    });

    api = setup.api;
  });

  afterAll(async () => {
    await setup.stop();
  });

  it("GET /v1/health", async () => {
    const version = faker.string.alphanumeric(16);
    process.env.APP_VERSION = version;

    await api
      .get("/v1/health")
      .expect(200)
      .expect((res) =>
        expect(res.body).toMatchObject({
          status: "OK",
          build: {
            version,
          },
        }),
      );
  });
});
