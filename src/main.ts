import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma/exception-filter/prisma-client-exception.filter';

const logger = new Logger('Main');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // parse input of fields that do not align with DTO
      transform: true, // this is enough for body parameters (DTO's of body if marked as int would get auto converted from string)
      transformOptions: {
        enableImplicitConversion: true, // converts query arguments as well
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('Prisma Day - NestJS Prisma Workshop')
    .setDescription('Building a REST API with NestJS and Prisma')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { customSiteTitle: 'Prisma Day' });

  const port = 3000;
  await app.listen(port);
  logger.log(`API: http://localhost:${port}/api`);
}

bootstrap();
