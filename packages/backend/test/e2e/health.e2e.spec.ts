import { ReturnModelType } from "@typegoose/typegoose";
import { HealthModule } from "src/healthcheck/health.module";
import { User } from "src/model/user.model";
import TestAgent from "supertest/lib/agent";
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
    await api.get("/v1/health").expect(200).expect({
      status: "OK",
    });
  });
});
