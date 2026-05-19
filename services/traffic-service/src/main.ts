import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Traffic Service API')
    .setDescription('Traffic zones, congestion detection, and analytics microservice')
    .setVersion('1.0')
    .addTag('zones', 'Traffic zone operations')
    .addTag('congestion', 'Traffic congestion analysis')
    .addTag('analytics', 'Traffic analytics and simulation')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  logger.log(`🚦 Traffic Service running on http://localhost:${port}/api/v1`);
  logger.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
  logger.log(`🧭 GraphQL endpoint at http://localhost:${port}/graphql`);
}

bootstrap();
