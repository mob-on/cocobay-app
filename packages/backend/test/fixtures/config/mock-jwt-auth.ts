import { faker } from "@faker-js/faker/.";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { LoggedInUser } from "src/auth/logged-in-user-data";

export const mockJwtService: () => Partial<JwtService> = () => {
  return {
    sign: jest.fn().mockImplementation(() => faker.string.alphanumeric(64)),
    verify: jest
      .fn()
      .mockReturnValue({ id: faker.string.numeric() } as LoggedInUser),
  };
};

export const mockJwtProvider = () => {
  return {
    provide: JwtService,
    useValue: mockJwtService(),
  };
};

export const mockJwtAuthGuard: () => Partial<JwtAuthGuard> = () => {
  return {
    canActivate: jest.fn().mockImplementation(() => true),
  };
};
