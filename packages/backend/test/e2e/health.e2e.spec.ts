import { faker } from "@faker-js/faker";
import { ReturnModelType } from "@typegoose/typegoose";
import { HealthModule } from "backend/src/healthcheck/health.module";
import TestAgent from "supertest/lib/agent";
import { User } from "../../src/user/user.model";
import { setupEndToEnd, TestControl } from "./setup/setup";

describe("HealthController (e2e)", () => {
  let tests: TestControl;
  let api: TestAgent;
  let userModel: ReturnModelType<typeof User>;

  beforeAll(async () => {
    ({
      control: tests,
      api,
      userModel,
    } = await setupEndToEnd({
      imports: [HealthModule],
    }));
  });

  afterAll(async () => {
    await tests.stop();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
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
          version,
        }),
      );
  });
});
