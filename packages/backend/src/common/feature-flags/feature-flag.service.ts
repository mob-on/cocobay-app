import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Feature } from "@config/features";

@Injectable()
export class FeatureService {
  constructor(private readonly configService: ConfigService) {}

  enabled(feature: Feature) {
    return this.configService.get<boolean>(`features.${feature}`);
  }
}
