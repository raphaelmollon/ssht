import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as MariaDBStore from 'express-mysql-session';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards(new AuthGuard(new Reflector()));

  app.use(session({
    secret: 'ssht-seriously-secret-hot-text',
    resave: false,
    saveUninitialized: false,
    store: new MariaDBStore({
      host: 'localhost',
      port: 3306,
      user: 'root', 
      password: 'root', 
      database: 'ssht',
    }),
  }));

  const options = new DocumentBuilder()
    .setTitle('SSHT : Savoye Software Hotline Tools')
    .setDescription('API with a bunch of useful tools for the SSCS team')
    .setVersion('1.0')
    .addTag('ssht-api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
