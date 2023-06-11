import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up cookie parser
  app.use(cookieParser());

  await app.listen(3000);
}

bootstrap();
