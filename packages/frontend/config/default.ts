import { ConfigSettings } from ".";

const config: Omit<ConfigSettings, "env"> = {
  features: {
    devMode: false,
    tracking: true,
  },
  apiBaseUrl: "https://cocoapp-api.twinsoft.es",
};

export default config;
