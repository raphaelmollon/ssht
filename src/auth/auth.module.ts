import { Module } from '@nestjs/common';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, RoleModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
