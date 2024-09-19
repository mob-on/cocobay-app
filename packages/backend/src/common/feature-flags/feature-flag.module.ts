import { Global, Module } from "@nestjs/common";
import { FeatureService } from "./feature-flag.service";

@Global()
@Module({
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
