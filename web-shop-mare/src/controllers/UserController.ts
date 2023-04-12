
import { Request, Response, NextFunction } from 'express';

import {UserEntity} from '../entities/UserEntity';

import {UserService} from '../services/UserService';

import winston from 'winston';
import bcrypt from 'bcrypt';
import {Security} from '../utils/Security';
import jwt from 'jsonwebtoken';
import { UserType } from '../enums/UserType';

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public async loginUser(req: Request, res: Response, next: NextFunction) {
        winston.info(`Login user | ${JSON.stringify(req.body)}`);
        if (!req.body) {
            res.status(400).send();
        }
        
        try {
            const user = await this.userService.findByUserName(req.body.userName);
            if (user) {
                const isMatch = await Security.checkHash(req.body.password, user.password);

                const token = jwt.sign({_id: user._id.toString()}, Security.secret, {expiresIn: '7 days'});
                const response = {token};

                if (isMatch) {
                    winston.info(`User logged in | username: ${user.userName}`);
                    res.status(200).send(response);
                } else {
                    res.status(400).send();
                }
            } else {
                res.status(404).send();
            }
        } catch (err: any) {
            winston.error(`Fetching user failed: ${err.stack}`);
            res.status(500).send();
        }
    }

    public async createUser(req: Request, res: Response) {
        // Log request
        winston.info(`Create user | ${JSON.stringify(req.body)}`);

        if (!req.body) {
            res.status(400).send();
        }

        try {
            const userExists = await this.userService.findByUserName(req.body.userName);
            if (userExists) {
                res.status(400).send(`User ${req.body.userName} exists`);
            }
        } catch (err: any) {
            winston.error(`Fetching user failed`);
        }

        // TODO: Validate input

        const user = new UserEntity();
        user.email = req.body.email;
        user.password = await Security.generateHash(req.body.password);
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.userName = req.body.userName;

        // For user type SALES or user type ADMIN add additional checks and confirmations
        user.userType = req.body.userType;
        

        // Set user registration params
        user.registrationConfirmed = false;

        // Unable to get user._id before saving it to database?
        // user.registrationToken = await Security.generateRegToken(user._id.toString());

        const uniqueUserString = user.userName + user.firstName + user.lastName;
        user.registrationToken = await Security.generateHash(uniqueUserString);


        let serviceResponse;
        try {
            serviceResponse = await this.userService.save(user);
            const response = {
                message: "User created",
                entity: serviceResponse
            }

            res.status(201).send(response);
        } catch (err: any) {
            winston.error(`Failed to create user: ${err.stack}`);
            res.status(500).send();
        }
    }

    public async getUserByUsername(req: Request, res: Response) {
        winston.info(`Get user by username: ${JSON.stringify(req.params)}`);
        
        let serviceResponse;
        try {
            serviceResponse = await this.userService.findByUserName(req.params.username);
            res.status(200).send(req.user);
        } catch (err: any) {
            winston.error(`User not found, ${err.stack}`);
            res.status(404).send();
        }
    }

    public async getMe(req: Request, res: Response) {
        winston.info(`Get me request`);
        res.status(200).send(req.user);
    }

    public async confirmUserRegistration(req: Request, res: Response) {
        winston.info(`Confirm registration: ${JSON.stringify(req.query)}`);

        let serviceResponse;
        try {
            const queryParams = req.query as { userName: string, registrationToken: string};
            const userName = queryParams.userName;
            const registrationToken = queryParams.registrationToken;
            serviceResponse = await this.userService.confirmRegistration(userName, registrationToken);
            // @ts-ignore
            if (serviceResponse?.registrationConfirmed) {
                // @ts-ignore
                winston.info(`Registration confirmed for user: ${serviceResponse.userName}`);
                res.status(200).send();
            } else {
                res.status(400).send();
            }
        } catch (err: any) {
            winston.error(`Failed to confirm registration`);
            res.status(400).send();
        }
    }

    public async getAllUsers(req: Request, res: Response) {
        winston.info('Get all users');
        try {
            const allUsers = await this.userService.findAll();
            res.status(200).send(allUsers);
        } catch (err: any) {
            winston.error(`Failed to get all useers`);
            res.status(500).send();
        }
    }

    public async deleteUser(req: Request, res: Response) {
        winston.info(`Delete user by username: ${JSON.stringify(req.params)}`);
        
        let serviceResponse;
        try {
            serviceResponse = await this.userService.deleteByUserName(req.params.username);
            res.status(200).send(req.user);
        } catch (err: any) {
            winston.error(`User not found, ${err.stack}`);
            res.status(404).send();
        }
    }

    public async updateUserType(req: Request, res: Response) {
        winston.info(`Update user type by username: ${JSON.stringify(req.params)}`);

        let serviceResponse;
        try {
            const user = await this.userService.findByUserName(req.params.username);
            if (!user) {
                winston.error(`User not found, ${req.params.username}`);
                res.status(404).send();
                return;
            }

            switch (req.params.newType) {
                case 'SALES':
                    user.userType = UserType.SALES;
                    break;
                case 'CUSTOMER':
                    user.userType = UserType.CUSTOMER;
                    break;
                default:
            }

            serviceResponse = await this.userService.save(user);
            res.status(200).send();
        } catch (err: any) {
            winston.error(`User not found, ${err.stack}`);
            res.status(400).send();
        }
    }
}