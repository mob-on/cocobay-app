import { Feature } from "@config/features";
import { FeatureService } from "src/common/feature-flags/feature-flag.service";

export interface MockFeatureService extends FeatureService {
  setFeature(feature: Feature, value: boolean): void;
}

export const mockFeatureService = () => {
  const config = new Map<string, unknown>();

  return {
    provide: FeatureService,
    useValue: {
      enabled: jest
        .fn()
        .mockImplementation((feature: Feature) =>
          config.get(`features.${feature}`),
        ),
      setFeature: jest
        .fn()
        .mockImplementation((feature: Feature, enabled: boolean) =>
          config.set(`features.${feature}`, enabled),
        ),
    },
  };
};
