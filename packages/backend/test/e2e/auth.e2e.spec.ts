import { faker } from "@faker-js/faker/.";
import { ConfigService } from "@nestjs/config";
import { BACKEND_JWT_COOKIE_NAME } from "@shared/src/cookie/auth";
import { TelegramWebappAuthDto } from "@shared/src/dto/auth/telegram-webapp-auth.dto";
import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import TestAgent from "supertest/lib/agent";
import { AuthModule } from "src/auth/auth.module";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { User } from "src/user/model/user.model";
import { mockJwtAuthGuard } from "test/fixtures/config/mock-jwt-auth";
import { createValidUser } from "test/fixtures/model/user.data";
import { apiCreateUser } from "test/fixtures/rest/user";
import {
  configureTelegramForSuccess,
  createValidWebappInitData,
} from "test/fixtures/telegram/telegram-data";
import { ApiSetup, setupApi } from "test/setup/setup";

describe("AuthController", () => {
  let setup: ApiSetup;
  let api: TestAgent;
  let config: ConfigService;
  let userModel: ReturnModelType<typeof User>;

  beforeAll(async () => {
    process.env.JWT_SECRET = faker.string.alphanumeric(64);

    setup = await setupApi(
      {
        imports: [AuthModule],
      },
      (module) =>
        module.overrideGuard(JwtAuthGuard).useValue(mockJwtAuthGuard()),
    );

    api = setup.api;
    config = setup.app.get(ConfigService);
    userModel = getModelForClass(User);
  });

  afterAll(async () => {
    await setup.stop();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await userModel.deleteMany({});
  });

  describe("POST /v1/auth/telegram/login", () => {
    it("should return 200 when auth information present and valid, and user exists", async () => {
      const userId = faker.number.int();
      const { initDataRaw } = createValidWebappInitData(userId);
      const user = createValidUser({
        id: userId.toString(),
      });

      await apiCreateUser(api, user);

      configureTelegramForSuccess(config);

      await api
        .post("/v1/auth/telegram/login")
        .send(
          new TelegramWebappAuthDto({
            initDataRaw: initDataRaw,
          }),
        )
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            user: expect.objectContaining(user),
            token: expect.any(String),
          });
        });
    });

    it("should return 200 and set a JWT token cookie when valid", async () => {
      const userId = faker.number.int();
      const { initDataRaw } = createValidWebappInitData(userId);
      const user = createValidUser({
        id: userId.toString(),
      });
      await apiCreateUser(api, user);

      configureTelegramForSuccess(config);

      await api
        .post("/v1/auth/telegram/login")
        .send(
          new TelegramWebappAuthDto({
            initDataRaw: initDataRaw,
          }),
        )
        .expect(200)
        .expect((res) => {
          expect(res.headers["set-cookie"]).toBeDefined();
          const cookies = res.headers["set-cookie"][0];
          expect(cookies).toContain(`${BACKEND_JWT_COOKIE_NAME}=`);
          const jwtCookie = cookies
            .split(";")
            .find((cookie) =>
              cookie.trim().startsWith(`${BACKEND_JWT_COOKIE_NAME}=`),
            );
          expect(jwtCookie).toBeDefined();
          const jwtValue = jwtCookie.split("=")[1];
          expect(jwtValue).toEqual(expect.any(String));
        });
    });

    it("should return 400 when auth info not present or not valid", async () => {
      await Promise.all([
        api.post("/v1/auth/telegram/login").send().expect(400),
        api
          .post("/v1/auth/telegram/login")
          .send({ userId: faker.string.sample() })
          .expect(400),
      ]);
    });
  });
});
