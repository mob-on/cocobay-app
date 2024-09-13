import { faker } from "@faker-js/faker";
import { ReturnModelType } from "@typegoose/typegoose";
import TestAgent from "supertest/lib/agent";
import { createValidUser } from "test/fixtures/model/user.data";
import { setupApi, TestControl } from "test/setup/setup";
import { User } from "../../src/user/model/user.model";
import { UserModule } from "../../src/user/user.module";

const mockUser = createValidUser();

describe("UserController", () => {
  let control: TestControl;
  let api: TestAgent;
  let userModel: ReturnModelType<typeof User>;

  beforeAll(async () => {
    const setup = await setupApi([User], {
      imports: [UserModule],
    });

    control = setup.control;
    api = setup.api;
    userModel = setup.models.user();
  });

  afterAll(async () => {
    await control.stop();
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
      const { id } = await (await userModel.create(mockUser)).save();

      return api
        .get(`/v1/user/${id}`)
        .expect(200)
        .then((res) => expect(res.body).toMatchObject(mockUser));
    });
  });

  describe("POST /v1/user", () => {
    it("should return a 400 when no valid body is provided", async () => {
      return api.post(`/v1/user`).send({}).expect(400);
    });

    it("should return a 201 when a valid user is created", async () => {
      return api.post(`/v1/user`).send(mockUser).expect(201);
    });

    it("should return a 400 when trying to create a user that already exists", async () => {
      await api.post(`/v1/user`).send(mockUser).expect(201);
      return api.post(`/v1/user`).send(mockUser).expect(400);
    });
  });
});
