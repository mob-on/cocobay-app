import { Injectable } from "@nestjs/common";
import { Config } from "backend/config";
import { Feature } from "src/shared/lib/FeatureFlags";

@Injectable()
export class HealthService {
  getHealth(): object {
    const baseHealth = {
      status: "OK",
      build: {
        version: process.env.APP_VERSION,
        date: process.env.BUILD_TIME,
      },
    };

    if (Feature.DEV_MODE) {
      return {
        ...baseHealth,
        config: Config,
      };
    } else {
      return baseHealth;
    }
  }
}
