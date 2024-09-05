import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  getHealth() {
    return {
      status: "OK",
      version: process.env.APP_VERSION,
    };
  }
}
