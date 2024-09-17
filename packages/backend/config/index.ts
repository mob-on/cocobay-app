import { merge } from "lodash";
import baseConfig from "./default";
//eslint-disable-next-line import/no-unresolved
import localConfig from "./local";
import prodConfig from "./prod";
import stageConfig from "./stage";

export interface ConfigSettings {
  env: string; //"local" | "stage" | "prod"
  features: { [key: string]: boolean };
}

export const Config = ((): ConfigSettings => {
  let config: Partial<ConfigSettings>;
  switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
    case "stage":
      config = stageConfig;
      break;
    case "prod":
      config = prodConfig;
      break;
    default:
      config = localConfig;
      break;
  }

  return merge(baseConfig, config);
})();
