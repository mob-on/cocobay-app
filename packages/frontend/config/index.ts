import baseConfig from "./default";
//eslint-disable-next-line import/no-unresolved
import localConfig from "./local";
import prodConfig from "./prod";
import stageConfig from "./stage";

export interface ConfigSettings {
  env: "local" | "stage" | "prod";
  features?: { [key: string]: boolean };
  apiBaseUrl?: string;
}

export const Config = ((): ConfigSettings => {
  let config: Partial<ConfigSettings>;
  switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
    case "stage":
      config = stageConfig as ConfigSettings;
      break;
    case "prod":
      config = prodConfig as ConfigSettings;
      break;
    default:
      config = localConfig as ConfigSettings;
      break;
  }

  return { ...baseConfig, ...config } as ConfigSettings;
})();
