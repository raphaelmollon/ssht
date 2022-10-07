import { Command } from "src/command/command.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Environment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    parentId: number;

    @Column()
    name: string;

    @Column()
    firstChildOnly: boolean;

    @OneToMany(() => Command, (command) => command.environment)
    commands: Command[];

    @Column()
    createdBy: string;
    
    @Column()
    createdAt: Date;
    
    @Column()
    modifiedBy: string;
    
    @Column()
    modifiedAt: Date;
}
