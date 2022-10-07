import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandController } from './command.controller';
import { Command } from './command.entity';
import { CommandService } from './command.service';

@Module({
  imports: [TypeOrmModule.forFeature([Command])],
  controllers: [CommandController],
  providers: [CommandService]
})
export class CommandModule {}
