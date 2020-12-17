import { NextFunction, Router } from 'express';
import { UserController } from '../controllers/UserController';
import { Authenticate } from '../middleware/Authenticate';

export class UserRouter {
    private userController: UserController;
    private router: Router;
    private middleware: Authenticate;

    constructor(controller: UserController, middleware: Authenticate) {
        this.userController = controller;
        this.middleware = middleware;

        this.router = Router();        
        this.initRoutes();
    }

    private initRoutes() {
        const controller = this.userController;
        const middleware = this.middleware;

        this.router.post('/login', controller.loginUser.bind(controller));
        
        this.router.post('/user', controller.createUser.bind(controller));

        this.router.get('/user/me', middleware.authenticate.bind(middleware), controller.getMe.bind(controller));

        this.router.get('/user/:username', middleware.authenticate.bind(middleware), controller.getUserByUsername.bind(controller));

        // this.router.get('/user', this.userController.getUser);

        // this.router.get('/me', async (req, res) => { });

        this.router.get('/register', controller.confirmUserRegistration.bind(controller));

        // this.router.patch('/user', this.userController.updateUser);

        // this.router.delete('/user/:id', async (req, res) => {});
    }

    public getRouter() : Router {
        return this.router;
    }
}