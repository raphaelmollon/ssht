import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { User } from './user.entity';
import { UserService } from './user.service';

@Crud({
    model: {
        type: User,
    },
    query: {
        join: {
            role: {
                eager: true,
            },
        },
    },
})
@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly service: UserService)  {}
}
