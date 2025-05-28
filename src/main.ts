import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  const configSwagger = new DocumentBuilder()
    .setTitle('BackToBackup API')
    .setDescription('BackToBackup API description')
    .setVersion('1.0')
    .addSecurity('refresh_token', {
      type: 'http',
      in: 'cookie',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'refresh_token',
    })
    .addSecurity('token', {
      type: 'http',
      in: 'cookie',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'token',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup('docs', app, documentFactory);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Error al iniciar la aplicación:', error);
});
