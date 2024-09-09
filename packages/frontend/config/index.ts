import _object from "lodash/object";
import baseConfig from "./default";
import stageConfig from "./stage";
import localConfig from "./local";
import prodConfig from "./prod";

interface ConfigSettings {
  env: "local" | "stage" | "prod";
  features?: { [key: string]: boolean };

  apis: {
    main: {
      baseUrl: string;
    };
  };
}

export const Config = ((): ConfigSettings => {
  let config: any;
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

  return _object.merge(baseConfig, config);
})();

export default Config;
