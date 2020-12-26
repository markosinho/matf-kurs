import { NextFunction, Router } from 'express';
import { UserController } from '../controllers/UserController';
import { Authentication } from '../middleware/Authentication';
import { Authorization } from '../middleware/Authorization';

export class UserRouter {
    private userController: UserController;
    private router: Router;
    private authenticationService: Authentication;
    private authorizationService: Authorization;

    constructor(controller: UserController, authenticationService: Authentication,
            authorizationService: Authorization) {
        this.userController = controller;
        this.authenticationService = authenticationService;
        this.authorizationService = authorizationService;

        this.router = Router();        
        this.initRoutes();
    }

    private initRoutes() {
        const controller = this.userController;
        const authorizationService = this.authorizationService;
        const authenticationService = this.authenticationService;

        this.router.post('/login', controller.loginUser.bind(controller));
        
        this.router.post('/user', controller.createUser.bind(controller));

        this.router.get('/user/me', authenticationService.authenticate.bind(authenticationService),
            controller.getMe.bind(controller));

        this.router.get('/users/all', // authenticationService.authenticate.bind(authenticationService),
            // authorizationService.authorize.bind(authorizationService),
            controller.getAllUsers.bind(controller));

        this.router.get('/user/:username', authenticationService.authenticate.bind(authenticationService), 
            controller.getUserByUsername.bind(controller));

        // this.router.get('/user', this.userController.getUser);

        // this.router.get('/me', async (req, res) => { });

        this.router.get('/register', controller.confirmUserRegistration.bind(controller));

        // this.router.patch('/user', this.userController.updateUser);

        this.router.delete('/user/:username', controller.deleteUser.bind(controller));
    }

    public getRouter() : Router {
        return this.router;
    }
}