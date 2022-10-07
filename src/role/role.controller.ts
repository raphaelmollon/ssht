import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedRequest } from '@nestjsx/crud';
import { Roles } from 'src/decorators/roles.decorator';
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
@Roles('editor', 'reader')
@Controller('roles')
export class RoleController implements CrudController<Role> {
    constructor(public readonly service: RoleService) {}

    get base(): CrudController<Role> {
        return this;
    }

    // example of overrided route. we need : 
    // - implements CrudController<Entity>
    // - set the service to public
    // - define get base()
    // - use @Override
    // - use the name of the method without "Base" suffix
    // - inject @ParsedRequest() req: CrudRequest as a parameter
    @Get()
    @Override()
    getMany(
        @ParsedRequest() req: CrudRequest,
    ) {
        return this.base.getManyBase(req);
    }

}
