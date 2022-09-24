import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
    constructor(@InjectRepository(User) repo) {
        super(repo);
    }

    async findOneById(id: number): Promise<User> {
        return this.repo.findOneBy({ id });
    }

    async findOneByUsername(username: string, deep?:boolean): Promise<User> {
        return this.repo.findOne({where: { username }, relations: { role: deep }});
    }

    async createUser(u: User): Promise<User> {
        return this.repo.save(u);
    }

    async refreshLastConnection(id: number): Promise<any> {
        return this.repo.update(id, {lastConnection: new Date()});
    }
}

/*
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOneById(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    async findOneByUsername(username: string): Promise<User> {
        return this.userRepository.findOneBy({ username });
    }

    async createOne(u: User): Promise<User> {
        return this.userRepository.save(u);
    }

    async refreshLastConnection(id: number): Promise<any> {
        return this.userRepository.update(id, {lastConnection: new Date()});
    }
}
*/