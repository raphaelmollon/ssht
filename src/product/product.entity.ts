import { Command } from "src/command/command.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    parentId: number;

    @Column()
    name: string;

    @Column()
    firstChildOnly: boolean;

    @OneToMany(() => Command, (command) => command.product)
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
