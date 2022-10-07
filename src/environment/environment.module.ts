import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentController } from './environment.controller';
import { Environment } from './environment.entity';
import { EnvironmentService } from './environment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Environment])],
  controllers: [EnvironmentController],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
