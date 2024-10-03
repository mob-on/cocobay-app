import { ConfigSettings } from ".";

const config: ConfigSettings = {
  env: "local",
  features: { devMode: true, tracking: false },
  apiBaseUrl: "http://localhost:3001",
};

export default config;
