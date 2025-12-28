import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 全局前缀
  const apiPrefix = configService.get<string>('apiPrefix') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // 安全头
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 全局异常过滤器
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 全局响应转换拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger文档
  const swaggerEnable = configService.get<boolean>('swagger.enable');
  if (swaggerEnable) {
    const config = new DocumentBuilder()
      .setTitle(
        configService.get<string>('swagger.title') || '供应链订货系统API',
      )
      .setDescription(configService.get<string>('swagger.description') || '')
      .setVersion(configService.get<string>('swagger.version') || '1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
  console.log(
    `Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  if (swaggerEnable) {
    console.log(`Swagger docs: http://localhost:${port}/docs`);
  }
}
bootstrap();
