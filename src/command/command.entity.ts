import { Environment } from "src/environment/environment.entity";
import { Product } from "src/product/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Command {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => Product, (product) => product.commands)
    product: Product;

    @ManyToOne(() => Environment, (environment) => environment.commands)
    environment: Environment;

    @Column()
    description: string;

    @Column({type: "text"})
    text: string;

    @Column()
    comment: string;

    @Column()
    public: boolean;

    @Column()
    createdBy: string;
    
    @Column()
    createdAt: Date;
    
    @Column()
    modifiedBy: string;
    
    @Column()
    modifiedAt: Date;

}