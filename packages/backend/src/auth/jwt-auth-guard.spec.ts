import { faker } from "@faker-js/faker/.";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
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
  let configService: ConfigService;
  let mockController: MockController;
  let jwtService: JwtService;

  beforeEach(async () => {
    setup = await setupApi({
      controllers: [MockController],
      providers: [JwtAuthGuard, JwtService],
    });

    api = setup.api;

    mockController = setup.module.get(MockController);
    configService = setup.module.get(ConfigService);
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

  it("should allow correctly authenticated controller calls", async () => {
    const secret = faker.string.alphanumeric(64);
    const token = jwtService.sign(
      { id: faker.string.numeric() } as LoggedInUser,
      {
        secret,
      },
    );
    configService.set("secrets.jwtSecret", secret);

    await api
      .get("/v1/mock/auth")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });
});
