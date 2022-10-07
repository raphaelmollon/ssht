import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Command } from './command.entity';

@Crud({
    model: {
        type: Command,
    },
    query: {
        join: {
            product: {
                eager: true,
            },
            environment: {
                eager: true,
            },
        },
    },
})
@ApiTags('command')
@Controller('commands')
export class CommandController {}
