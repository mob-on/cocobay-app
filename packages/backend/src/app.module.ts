import { TypegooseModule } from "@m8a/nestjs-typegoose";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import "dotenv/config";
import configuration from "../config/configuration";
import { AuthModule } from "./auth/auth.module";
import { BoostsModule } from "./boosts/boosts.module";
import { BuildsModule } from "./builds/builds.module";
import { FeatureModule } from "./common/feature-flags/feature-flag.module";
import { GameDataModule } from "./game-data/game-data.module";
import { GameStateModule } from "./game-state/game-state.module";
import { HealthModule } from "./healthcheck/health.module";
import { TimeModule } from "./time/time.module";
import { UserModule } from "./user/user.module";

//Any updates to global modules must be reflected in the test setup, search of #TEST_SETUP_GLOBAL_MODULES
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      cache: true, //Because loading env variables is slow, and we don't expect real time env changes
      isGlobal: true,
    }),
    {
      module: FeatureModule,
      global: true,
    },
    TypegooseModule.forRoot(process.env.MONGODB_URI),
    HealthModule,
    UserModule,
    AuthModule,
    BuildsModule,
    BoostsModule,
    GameDataModule,
    GameStateModule,
    TimeModule,
  ],
})
export class AppModule {}
