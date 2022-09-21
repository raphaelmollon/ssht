import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Crud({
    model: {
        type: Role,
    },
    query: {
        join: {
            users: {
                eager: true,
            },
        },
    },
})
@ApiTags('role')
@Controller('roles')
export class RoleController {
    constructor(private readonly service: RoleService) {}
}
