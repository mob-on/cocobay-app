import { faker } from "@faker-js/faker";
import TestAgent from "supertest/lib/agent";
import { User } from "src/user/model/user.model";
import { UserModule } from "src/user/user.module";
import { createValidUserDto } from "test/fixtures/model/user.data";
import { ApiSetup, setupApi } from "test/setup/setup";

const mockUser = createValidUserDto();

describe("UserController", () => {
  describe("GET /v1/user/:userId", () => {
    let setup: ApiSetup;
    let api: TestAgent;

    beforeAll(async () => {
      setup = await setupApi([User], {
        imports: [UserModule],
      });

      api = setup.api;
    });

    afterAll(async () => {
      await setup.stop();
    });

    beforeEach(async () => {
      await setup.clearModels();
    });

    it("should return a 404 when the user does not exist", async () => {
      const userId = faker.string.numeric(16);

      return api.get(`/v1/user/${userId}`).expect(404);
    });

    it("should return a valid user when the user exists", async () => {
      await api.post("/v1/user").send(mockUser).expect(201);

      return api
        .get(`/v1/user/${mockUser.id}`)
        .expect(200)
        .then((res) => expect(res.body).toMatchObject(mockUser));
    });
  });

  describe("POST /v1/user", () => {
    let setup: ApiSetup;
    let api: TestAgent;

    beforeAll(async () => {
      setup = await setupApi([User], {
        imports: [UserModule],
      });

      api = setup.api;
    });

    afterAll(async () => {
      await setup.stop();
    });

    beforeEach(async () => {
      await setup.clearModels();
    });

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
