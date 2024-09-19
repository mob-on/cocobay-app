import { ConfigService } from "@nestjs/config";

export interface MockConfigService extends ConfigService {
  set: (key: string, value: unknown) => void;
}

export const mockConfigService: () => Partial<MockConfigService> = () => {
  const config = new Map<string, unknown>();

  return {
    get: jest.fn().mockImplementation((key: string) => config.get(key)),
    set: jest
      .fn()
      .mockImplementation((key: string, value: unknown) =>
        config.set(key, value),
      ),
  };
};

export const mockConfigProvider = () => {
  return {
    provide: ConfigService,
    useValue: mockConfigService(),
  };
};
