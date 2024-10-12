import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { AuthModule } from './auth/auth.module';
import { JustifyModule } from './justify/justify.module';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';
import { APP_PIPE } from '@nestjs/core';

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
  providers: [
    {
      // Enable validation globally
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // makes sure incoming requests don't have extra fields
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(bodyParser.text({ type: 'text/plain' }) as any)
      .forRoutes({ path: '/justify', method: RequestMethod.POST });
  }
}
