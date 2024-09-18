import { Config } from "@config/index";

const FeatureConfig = {
  DEV_MODE: Config.features?.devMode,
};

export const Feature = FeatureConfig;
