import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bodyParser from 'body-parser';

import { JustifyModule } from './justify/justify.module';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    JustifyModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes config accessible globally without needing to import it in every module
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: [User],
      synchronize: true, // only in dev mode
      // logging: true, // Enable logging for debugging
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
      .apply(bodyParser.text({ type: 'text/plain' })) // handle text/plain content type
      .forRoutes({ path: '/justify', method: RequestMethod.POST });
  }
}
