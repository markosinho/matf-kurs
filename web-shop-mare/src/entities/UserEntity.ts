import { Entity, Column, ObjectIdColumn, ObjectID, Index } from 'typeorm';
import { UserType } from '../enums/UserType';

export interface IUserEntity {
    _id: ObjectID;
    email: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    registrationConfirmed: boolean;
    registrationToken: string;
    userType: UserType;
}

@Entity()
export class UserEntity implements IUserEntity {
    @ObjectIdColumn()
    _id!: ObjectID;

    @Column()
    @Index({ unique: true })
    email!: string;

    @Column()
    @Index({ unique: true })
    userName!: string;

    @Column()
    password!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    registrationConfirmed!: boolean;

    @Column()
    registrationToken!: string;

    @Column()
    userType!: UserType;
}