import * as compression from 'compression';
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigVar } from './configs';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://nest-session-based-auth.herokuapp.com',
    ],
    credentials: true,
  });
  app.use(compression());
  app.use(helmet());

  app.use(
    session({
      secret: 'session-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  const config = new DocumentBuilder()
    .setTitle('Personal Blog API')
    .setDescription('NestJS API - MongoDB for Dung Dung')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const host = configService.get<string>(ConfigVar.HOST);
  const port = configService.get<number>(ConfigVar.PORT);
  await app.listen(port, () => {
    console.log(`Server is listening at ${host}:${port}`);
  });
}
bootstrap();
