import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  // Set up cookie parser
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin:[
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://42transcendence.me',
      'http://www.42transcendence.me',
      'http://api.42transcendence.me',
      'https://42transcendence.me',
      'https://www.42transcendence.me',
      'https://api.42transcendence.me'
    ],
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
