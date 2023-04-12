import express from 'express';
import bodyparser from 'body-parser';
import config from 'config';

import { UserRepo } from './repositories/UserRepo';
import { UserService } from './services/UserService';
import { UserController } from './controllers/UserController';
import { UserRouter } from './routers/UserRouter';

import { Logger } from './utils/Logger';
import { Connection, createConnection } from 'typeorm';
import winston from 'winston';
import { Authentication } from './middleware/Authentication';
import { Authorization } from './middleware/Authorization';
import * as cors from 'cors';
import { ProductController } from './controllers/ProductController';
import { ProductRepo } from './repositories/ProductRepo';
import { ProductService } from './services/ProductService';
import { ProductRouter } from './routers/ProductRouter';
import {ConnectionMock} from "./repositories/ConnectionMock";

// const corsOptions: cors.CorsOptions = {
//     allowedHeaders: [
//         'Origin',
//         'X-Requested-With',
//         'Content-Type',
//         'Accept',
//         'X-Access-Token',
//       ],
//       credentials: true,
//       methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
//       origin: 'ts',
//       preflightContinue: false,
// }


class App {
    private server: express.Application;
    private readonly port: number;

    constructor(port: number) {
        this.server = express();
        this.port = port;
        this.init();
    }

    private async init() {
        this.setupLogger();
        const connection = await this.initDatabase();
        this.initMiddleware();
        this.initRouters(connection);
    }

    private setupLogger() {
        Logger.setup(process.cwd(), config);
    }

    private async initDatabase() {
        try {
            // const connection : Connection = await createConnection();
            const connection : ConnectionMock = new ConnectionMock();
            winston.debug(`Connected to database: ${connection.isConnected}`);
            return connection;
        } catch (err: any) {
            winston.error(err);
            throw new Error('No database connection');
        }
    }

    private initMiddleware() {
        
        this.server.use(bodyparser.json());
        this.server.use(bodyparser.urlencoded({ extended: true }));
        this.server.use(cors.default());
    }

    private initRouters(connection: ConnectionMock) {
        
        const userService = new UserService(new UserRepo(connection));
        const authenticationService = new Authentication(userService);
        const authorizationService = new Authorization(userService);        
        const userController = new UserController(userService);
        const userRouter = new UserRouter(userController, authenticationService, authorizationService);

        const productService = new ProductService(new ProductRepo(connection));
        const productController = new ProductController(productService);
        const productRouter = new ProductRouter(productController, authenticationService, authorizationService);

        this.server.use(userRouter.getRouter());
        this.server.use(productRouter.getRouter());
    }

    public start() {
        this.server.listen(this.port, () => {
            winston.info(`Server listening on port: ${this.port}`);
        });
    }
}

const port: number = config.get('port') || 3830;
const app = new App(port);
app.start();
