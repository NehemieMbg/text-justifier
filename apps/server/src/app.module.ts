import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JustifyModule } from './justify/justify.module';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    JustifyModule,
    RateLimitingModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes config accessible globally without needing to import it in every module
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
