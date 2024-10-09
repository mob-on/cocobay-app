import { readFileSync } from "fs";
import { join } from "path";
import { Logger } from "@nestjs/common";
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

/**
 * Interface representing the settings for Cross-Origin Resource Sharing (CORS).
 * Cors MUST be enabled even locally; allowAllOrigins is the most permissive setting.
 * Follows declarations as set in https://github.com/expressjs/cors?tab=readme-ov-file#configuration-options
 */
export interface CorsSettings {
  /**
   * If true, allows all origins to access the resource. If false, cors are disabled.
   * @default false
   */
  allowAllOrigins?: boolean;

  /**
   * A specific origin that is allowed to access the resource.
   * Usually in the format [protocol]://hostname
   */
  specificOrigin?: string;

  /**
   * A regular expression pattern to match specific origins that are allowed to access the resource.
   */
  specificOriginRegExp?: string;

  /**
   * An array of specific origins that are allowed to access the resource.
   */
  originsString?: string[];

  /**
   * An array of regular expression patterns to match specific origins that are allowed to access the resource.
   */
  originsRegExp?: string[];
}

export interface ConfigSecrets {
  jwtSecret: string;
  telegram: {
    appToken: string;
  };
}

export interface ConfigSettings {
  env: string; //"local" | "stage" | "prod"
  features?: { [key: string]: boolean };
  cors?: CorsSettings;
  telegram: {
    webappDataExpirySeconds: number;
  };
  session: {
    expiryMinutes: number;
  };
  secrets: ConfigSecrets;
}

export const validateRequiredEnvVariables = () => {
  const requirements = [
    "APP_VERSION",
    "APP_ENVIRONMENT",
    "JWT_SECRET",
    "TELEGRAM_APP_TOKEN",
    "MONGODB_URI",
  ];
  const errors = [];

  for (const req of requirements) {
    if (process.env[req] === undefined) {
      errors.push(`${req} ENV variable is required`);
    }
  }

  if (errors.length > 0) {
    const log = new Logger("BackendConfiguration");
    log.fatal(`Missing required ENV variables:\n${errors.join("\n")}`);
    process.exit(1);
  }

  return true;
};

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
      } as ConfigSecrets,
    },
  ) as ConfigSettings;
};
