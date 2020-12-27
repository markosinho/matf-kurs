import { Entity, Column, ObjectIdColumn, ObjectID, Index } from 'typeorm';

export interface IProductEntity {
    _id: ObjectID;
    codename: string;
    title: string;
    price: number;
    description: string;
    category: number;
}

@Entity()
export class ProductEntity implements IProductEntity {
    @ObjectIdColumn()
    _id!: ObjectID;

    @Column()
    @Index({ unique: true})
    codename!: string;

    @Column()
    @Index({ unique: true })
    title!: string;

    @Column()
    price!: number;

    @Column()
    description!: string;

    @Column()
    category!: number;
}