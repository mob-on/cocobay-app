import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "src/user/service/user.service";
import { mockConfigProvider } from "test/fixtures/config/mock-config-provider";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: jest.fn(),
        },
        mockConfigProvider(),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
