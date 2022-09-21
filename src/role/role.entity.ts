import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    cdate: Date;

    @Column({nullable: true})
    cuser: string;

    @Column({nullable: true})
    mdate: Date;

    @Column({nullable: true})
    muser: string;

    @ApiProperty({ type: () => User })
    @OneToMany(() => User, (user) => user.role)
    users: User[];
}