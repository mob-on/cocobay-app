import { faker } from "@faker-js/faker";
import { ReturnModelType } from "@typegoose/typegoose";
import { User } from "src/model/user.model";
import { UserModule } from "src/user/user.module";
import TestAgent from "supertest/lib/agent";
import { setupEndToEnd, TestControl } from "./setup/setup";

describe("UserController", () => {
  let tests: TestControl;
  let api: TestAgent;
  let userModel: ReturnModelType<typeof User>;

  beforeAll(async () => {
    ({
      control: tests,
      api,
      userModel,
    } = await setupEndToEnd({
      imports: [UserModule],
    }));
  });

  afterAll(async () => {
    await tests.stop();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  describe("GET /v1/user/:userId", () => {
    it("should return a 404 when the user does not exist", async () => {
      const userId = faker.number.int();

      const req = api.get(`/v1/user/${userId}`);

      return req.expect(404);
    });

    it("should return a valid user when the user exists", async () => {
      const userId = faker.number.int();
      await userModel.create({
        id: userId,
      });

      const req = api.get(`/v1/user/${userId}`);

      return req.expect(200).expect((res) =>
        expect(res.body).toMatchObject({
          id: userId,
        }),
      );
    });
  });
});
