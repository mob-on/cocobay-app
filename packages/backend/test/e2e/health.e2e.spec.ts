import { HealthModule } from "src/healthcheck/health.module";
import TestAgent from "supertest/lib/agent";
import { setupEndToEnd, TestControl } from "./setup";

describe("HealthController (e2e)", () => {
  let tests: TestControl;
  let api: TestAgent;

  beforeAll(async () => {
    ({ control: tests, api } = await setupEndToEnd({
      imports: [HealthModule],
    }));
  });

  afterAll(async () => {
    await tests.stop();
  });

  it("GET /v1/health", () => {
    return api.get("/v1/health").expect(200).expect({
      status: "OK",
    });
  });
});
