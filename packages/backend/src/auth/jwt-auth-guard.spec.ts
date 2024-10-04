import { faker } from "@faker-js/faker/.";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { BACKEND_JWT_COOKIE_NAME } from "@shared/src/cookie/auth";
import TestAgent from "supertest/lib/agent";
import { ApiSetup, setupApi } from "test/setup/setup";
import { JwtAuthGuard } from "./jwt-auth-guard";
import { LoggedInUser } from "./logged-in-user-data";

describe("JwtAuthGuard", () => {
  @Controller("/mock")
  class MockController {
    constructor() {}

    @UseGuards(JwtAuthGuard)
    @Get("/auth")
    authCall() {}

    @Get("/anonymous")
    anonymousCall() {}
  }

  let setup: ApiSetup;
  let api: TestAgent;
  let config: ConfigService;
  let mockController: MockController;
  let jwtService: JwtService;

  beforeEach(async () => {
    setup = await setupApi({
      controllers: [MockController],
      providers: [JwtAuthGuard, JwtService],
    });

    api = setup.api;

    mockController = setup.module.get(MockController);
    config = setup.module.get(ConfigService);
    jwtService = setup.module.get(JwtService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await setup.stop();
  });

  it("should be defined", () => {
    expect(mockController).toBeDefined();
  });

  it("should allow anonymous controller calls", async () => {
    await api.get("/v1/mock/anonymous").expect(200);
  });

  it("should block authenticated controller calls", async () => {
    await api.get("/v1/mock/auth").expect(401);
  });

  it("should allow correctly authenticated controller calls using Authorization header", async () => {
    const secret = faker.string.alphanumeric(64);
    const token = jwtService.sign(
      { id: faker.string.numeric() } as LoggedInUser,
      {
        secret,
      },
    );
    config.set("secrets.jwtSecret", secret);

    await api
      .get("/v1/mock/auth")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should reject calls using a bad Authorization header", async () => {
    const secret = faker.string.alphanumeric(64);
    const token = jwtService.sign(
      { id: faker.string.numeric() } as LoggedInUser,
      {
        secret,
      },
    );
    // Set the secret to something different than the token
    config.set("secrets.jwtSecret", faker.string.alphanumeric(64));

    await api
      .get("/v1/mock/auth")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
  });

  it("should allow correctly authenticated controller calls using Cookies", async () => {
    const secret = faker.string.alphanumeric(64);
    const token = jwtService.sign(
      { id: faker.string.numeric() } as LoggedInUser,
      {
        secret,
      },
    );
    config.set("secrets.jwtSecret", secret);

    await api
      .get("/v1/mock/auth")
      .set("Cookie", [`${BACKEND_JWT_COOKIE_NAME}=${token}`])
      .expect(200);
  });

  it("should reject calls using a bad Cookie JWT token", async () => {
    const secret = faker.string.alphanumeric(64);
    const token = jwtService.sign(
      { id: faker.string.numeric() } as LoggedInUser,
      {
        secret,
      },
    );
    // Set the secret to something different than the token
    config.set("secrets.jwtSecret", faker.string.alphanumeric(64));

    await api
      .get("/v1/mock/auth")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
  });

  it("should reject calls using an expired token", async () => {
    const secret = faker.string.alphanumeric(64);
    const token = jwtService.sign(
      { id: faker.string.numeric() } as LoggedInUser,
      {
        secret,
        expiresIn: "-30m",
      },
    );
    config.set("secrets.jwtSecret", secret);

    await api
      .get("/v1/mock/auth")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
  });
});
