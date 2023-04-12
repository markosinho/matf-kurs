import { ProductEntity } from '../entities/ProductEntity';
import { Connection } from 'typeorm';
import winston from 'winston'
import {ConnectionMock} from "./ConnectionMock";

export class ProductRepo {
    private connection: ConnectionMock;

    constructor(connection: ConnectionMock) {
        this.connection = connection;
    }

    public async save(product: ProductEntity) {
        return this.connection.mongoManager.save(product);
    }

    public async findByCodename(codename: string) {
        return this.connection.mongoManager.findOne(ProductEntity, { codename })
    }

    public async findByTitle(title: string) {
        return this.connection.mongoManager.findOne(ProductEntity, { title });
    }

    public async deleteByCodename(codename: string) {
        return this.connection.mongoManager.deleteOne(ProductEntity, { codename });
    }

    public async deleteByTitle(title: string) {
        return this.connection.mongoManager.deleteOne(ProductEntity, { title });
    }

    public async findById(productId: string) {
        let product;
        try {
            product = await this.connection.mongoManager.findOne(ProductEntity, productId);
        } catch (err: any) {
            winston.error(err.stack);
        }
        return product;
    }

    public async findAll() {
        let allUsers;
        try {
            allUsers = await this.connection.mongoManager.find(ProductEntity);
        } catch (err: any) {
            winston.error('wtf');
            winston.error(err.stack);
        }
        return allUsers;
    }
}