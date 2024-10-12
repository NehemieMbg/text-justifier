import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * The bootstrap function initializes the NestJS application.
 * It creates an instance of the application, sets up global configurations,
 * and starts the server to listen on port 3000.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('/api');

  await app.listen(3000);
}
bootstrap();
