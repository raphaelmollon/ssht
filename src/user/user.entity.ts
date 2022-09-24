import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/role/role.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;
    
    @Column()
    salt: string;

    @Column()
    email: string;

    @Column()
    active: boolean;

    @Column({nullable: true})
    lastConnection: Date;

    @Column()
    cdate: Date;

    @Column()
    cuser: string;

    @Column({nullable: true})
    mdate: Date;

    @Column({nullable: true})
    muser: string;

    @ApiProperty({ type: () => Role })
    @ManyToOne(() => Role, (role) => role.users)
    role: Role;
}