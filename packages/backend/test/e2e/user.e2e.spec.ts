import { faker } from "@faker-js/faker";
import { ReturnModelType } from "@typegoose/typegoose";
import TestAgent from "supertest/lib/agent";
import { UserDto } from "../../src/user/user.dto";
import { User } from "../../src/user/user.model";
import { UserModule } from "../../src/user/user.module";
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

      return api.get(`/v1/user/${userId}`).expect(404);
    });

    it("should return a valid user when the user exists", async () => {
      const userId = faker.number.int();
      await userModel.create({
        id: userId,
      });

      return api
        .get(`/v1/user/${userId}`)
        .expect(200)
        .then((res) =>
          expect(res.body).toMatchObject({
            id: userId,
          }),
        );
    });
  });

  describe("POST /v1/user", () => {
    it("should return a 400 when no valid body is provided", async () => {
      return api.post(`/v1/user`).send({}).expect(400);
    });

    it("should return a 201 when a valid user is created", async () => {
      return api
        .post(`/v1/user`)
        .send(new UserDto({ id: faker.number.int() }))
        .expect(201);
    });

    it("should return a 400 when trying to create a user that already exists", async () => {
      const user = new UserDto({ id: faker.number.int() });
      await api.post(`/v1/user`).send(user).expect(201);
      return api.post(`/v1/user`).send(user).expect(400);
    });
  });
});
