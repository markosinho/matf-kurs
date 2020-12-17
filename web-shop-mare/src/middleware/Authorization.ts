import { UserService } from '../services/UserService';
import { Request, Response, NextFunction } from 'express';
import { UserType } from '../enums/UserType';
import { HttpMethod } from '../enums/HttpMethod';
import {Security} from '../utils/Security';
import winston from 'winston';
import jwt from 'jsonwebtoken';
import { UserEntity } from '../entities/UserEntity';

import { IPermissions, IRoles }  from '../roles';
import Utils from '../utils/Utils'
import roles from '../roles';
import { Http } from 'winston/lib/winston/transports';

export class Authorization {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public authorize(req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            throw new Error('No user is provided to check permissions');
        }
        
        const permissionGranted = this.checkPermissions(req.user, req.method, req.url);

        if (permissionGranted) {
            next();
        } else {
            winston.error(`Forbidden action for user: ${req.user.userName}`);
            res.status(403).send();
        }
    }

    private checkPermissions(user: UserEntity, method: string, route: string) : boolean {
        if (user.userType === UserType.ADMIN) {
            return true;
        }
        
        const availableMethods = Utils.getProperty(roles, user.userType)

        // Warning! With this type of conversion from 'string' to 'enum', result can be undefined
        const methodEnum : HttpMethod = (<any>HttpMethod)[method.toUpperCase()];
        if (!methodEnum) {
            return false;
        }

        const routesArray : Array<string> = Utils.getProperty(availableMethods, methodEnum);
        return routesArray.includes(route);
    }
}