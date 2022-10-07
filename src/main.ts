import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as MariaDBStore from 'express-mysql-session';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  // guard for all
  app.useGlobalGuards(new AuthGuard(new Reflector()));

  // configure sessions
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

  // configure swagger for documentation
  const options = new DocumentBuilder()
    .setTitle('SSHT : Savoye Software Hotline Tools')
    .setDescription('API with a bunch of useful tools for the SSCS team')
    .setVersion('1.0')
    .addTag('ssht-api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  // configure the headers
  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept");
  //   res.header("Access-Control-Request-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  //   res.header("Access-Control-Allow-Credentials", true);
  //   next();
  // });

  // configure CORS
  app.enableCors({
    "origin": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    //"preflightContinue": true,
    "optionsSuccessStatus": 204,
    "credentials": true,
    "maxAge": 86400000
  });

  await app.listen(3000);
}
bootstrap();
