import { group } from "k6";
import http from "k6/http";

import { loadConfig } from "../config.js";

export const options = {
  discardResponseBodies: true,
  scenarios: {
    start: {
      executor: "constant-arrival-rate",
      timeUnit: "1s",
      duration: "10s",
      preAllocatedVUs: 200,
      rate: 200,
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<50"],
  },
};

export default () => {
  group("health", () => {
    http.get(`${loadConfig.baseUrl}/health`, {
      headers: loadConfig.headers,
      timeout: "10s",
      tags: {
        name: "health",
      },
    });
  });
};
