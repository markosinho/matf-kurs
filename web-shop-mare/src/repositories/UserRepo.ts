import {UserEntity} from '../entities/UserEntity';
import {Connection, ObjectID} from 'typeorm';
import winston from 'winston'
import {ConnectionMock} from "./ConnectionMock";

export class UserRepo {
    private connection: ConnectionMock;

    constructor(connection: ConnectionMock) {
        this.connection = connection;
    }

    public async save(user: UserEntity) {
        return this.connection.mongoManager.save(user);
    }

    public async findByUserName(userName: string) {
        return this.connection.mongoManager.findOne(UserEntity, {userName});
    }

    public async deleteByUserName(userName: string) {
        return this.connection.mongoManager.deleteOne(UserEntity, {userName});
    }

    public async findById(userId: string) {
        let user;
        try {
            user = await this.connection.mongoManager.findOne(UserEntity, userId);
        } catch (err: any) {
            winston.error(err.stack);
        }
        return user;
    }

    public async findAll() {
        let allUsers;
        try {
            allUsers = await this.connection.mongoManager.find(UserEntity);
        } catch (err: any) {
            winston.error(err.stack);
        }
        return allUsers;
    }
}