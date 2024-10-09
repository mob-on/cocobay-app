import { faker } from "@faker-js/faker";
import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import TestAgent from "supertest/lib/agent";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { User } from "src/user/model/user.model";
import { UserModule } from "src/user/user.module";
import { mockJwtAuthGuard } from "test/fixtures/config/mock-jwt-auth";
import { createValidUserDto } from "test/fixtures/model/user.data";
import { ApiSetup, setupApi } from "test/setup/setup";

const mockUser = createValidUserDto();

describe("UserController", () => {
  let setup: ApiSetup;
  let api: TestAgent;
  let userModel: ReturnModelType<typeof User>;

  beforeAll(async () => {
    setup = await setupApi(
      {
        imports: [UserModule],
      },
      (module) =>
        module.overrideGuard(JwtAuthGuard).useValue(mockJwtAuthGuard()),
    );

    api = setup.api;
    userModel = getModelForClass(User);
  });

  afterAll(async () => {
    await setup.stop();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await userModel.deleteMany({});
  });

  describe("GET /v1/user/:userId", () => {
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
