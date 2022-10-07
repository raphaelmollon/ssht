import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Environment } from './environment.entity';
import { EnvironmentService } from './environment.service';

@Crud({
    model: {
        type: Environment,
    },
    query: {
        join: {
            commands: {
                eager: true,
            },
        },
    },
})
@ApiTags('environment')
@Controller('environments')
export class EnvironmentController {
    constructor(public readonly service: EnvironmentService) {}
}
