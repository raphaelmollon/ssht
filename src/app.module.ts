import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { EnvironmentModule } from './environment/environment.module';
import { CommandModule } from './command/command.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', 
      host: 'localhost',
      port: 3306, 
      username: 'root', 
      password: 'root',
      database: 'ssht',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    RoleModule,
    AuthModule,
    ProductModule,
    EnvironmentModule,
    CommandModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
