import { UserService } from '../services/UserService';
import express from 'express';
import {Security} from '../utils/Security';
import winston from 'winston';
import jwt from 'jsonwebtoken';


export class Authentication {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public async authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
        const authToken = req.header('Authorization');
        if (typeof authToken !== 'string') {
            winston.info(`Unauthorized request atempt from ${req.ip}`);
            res.status(401).send();
            return;
        }

        try {
            winston.debug(`Authentication with token: ${authToken}`);
            // If fail throws invalid signature error
            const decoded = jwt.verify(authToken.replace('Bearer ', '').trim(), Security.secret) as { _id: string };
            const user = await this.userService.findByUserId(decoded['_id'].toString());
            req.body.user = user;
            next();
        } catch (err) {
            winston.error(`Authentication failed: ${err.stack}`);
            res.status(401).send();
        }
    }
}