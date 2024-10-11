import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * The bootstrap function initializes the NestJS application.
 * It creates an instance of the application, sets up global configurations,
 * and starts the server to listen on port 3000.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());

  // Set global prefix for all routes
  app.setGlobalPrefix('/api');

  await app.listen(3000);
}
bootstrap();
