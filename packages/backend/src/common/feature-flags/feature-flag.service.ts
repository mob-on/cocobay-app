import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Feature } from "@config/features";

@Injectable()
export class FeatureService {
  constructor(private readonly config: ConfigService) {}

  enabled(feature: Feature) {
    return this.config.get<boolean>(`features.${feature}`);
  }
}
