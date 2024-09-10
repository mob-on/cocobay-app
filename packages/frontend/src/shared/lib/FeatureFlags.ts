import Config from "../../../config";
import { LocalStorage } from "../LocalStorage";

const FeatureConfig = {
  DEV_MODE: Config.features?.devMode,
};

const featuresLocalStorageString =
  typeof window !== "undefined" &&
  window?.localStorage?.getItem(LocalStorage.FEATURES);
const featuresLocalStorage = featuresLocalStorageString
  ? JSON.parse(featuresLocalStorageString)
  : {};

export const Feature = { ...FeatureConfig, ...featuresLocalStorage };
