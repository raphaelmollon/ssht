import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
    constructor(@InjectRepository(Role) role) {
        super(role);
    }

    async findRoleByName(name: string): Promise<Role> {
        return this.repo.findOneBy({name});
    }
}
