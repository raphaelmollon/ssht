import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, RoleModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
