import * as compression from 'compression';
import helmet from 'helmet';
import { INestApplication, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigVar } from './configs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.use(compression());
  app.use(helmet());

  // app.use(
  //   session({
  //     secret: 'session-secret',
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );
  // app.use(passport.initialize());
  // app.use(passport.session());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  setupSwagger(app);

  const configService = app.get(ConfigService);
  const host = configService.get<string>(ConfigVar.HOST);
  const port = configService.get<number>(ConfigVar.PORT);
  await app.listen(port, () => {
    console.log(`Server is listening at ${host}:${port}`);
  });
}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Personal Blog API')
    .setDescription('NestJS API - MongoDB for Dung Dung')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

bootstrap();
