import { readFileSync } from "fs";
import { join } from "path";
import * as yaml from "js-yaml";
import { merge } from "lodash";

let config: string;
switch (process.env.APP_ENVIRONMENT) {
  case "stage":
  case "prod":
    config = process.env.APP_ENVIRONMENT;
    break;
  default:
    config = "local";
    break;
}

export interface ConfigSecrets {
  jwtSecret: string;
  telegram: {
    appToken: string;
  };
}

export interface ConfigSettings {
  env: string; //"local" | "stage" | "prod"
  features: { [key: string]: boolean };
  telegram: {
    webappDataExpirySeconds: number;
  };
  secrets: ConfigSecrets;
}

export default () => {
  return merge(
    yaml.load(
      readFileSync(join(__dirname, "default.yaml"), "utf8"),
    ) as Partial<ConfigSettings>,
    yaml.load(
      readFileSync(join(__dirname, `${config}.yaml`), "utf8"),
    ) as Partial<ConfigSettings>,
    {
      secrets: {
        jwtSecret: process.env.JWT_SECRET,
        telegram: {
          appToken: process.env.TELEGRAM_APP_TOKEN,
        },
      },
    },
  ) as ConfigSettings;
};
