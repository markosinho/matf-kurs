import {UserEntity} from '../entities/UserEntity';
import {Connection, ObjectID} from 'typeorm';
import winston from 'winston'

export class UserRepo {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    public async save(user: UserEntity) {
        return this.connection.mongoManager.save(user);
    }

    public async findByUserName(userName: string) {
        return this.connection.mongoManager.findOne(UserEntity, {userName});
    }

    public async findById(userId: string) {
        let user;
        try {
            user = await this.connection.mongoManager.findOne(UserEntity, userId);
        } catch (err) {
            winston.error(err.stack);
        }
        return user;
    }

    public async findAll() {
        let allUsers;
        try {
            allUsers = await this.connection.mongoManager.find(UserEntity);
        } catch (err) {
            winston.error('wtf');
            winston.error(err.stack);
        }
        return allUsers;
    }
}