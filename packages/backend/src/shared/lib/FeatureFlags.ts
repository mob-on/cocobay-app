import { Config } from "../../../config";

const FeatureConfig = {
  DEV_MODE: Config.features?.devMode,
};

export const Feature = FeatureConfig;
