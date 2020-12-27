import { NextFunction, Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { Authentication } from '../middleware/Authentication';
import { Authorization } from '../middleware/Authorization';

export class ProductRouter {
    private productController: ProductController;
    private router: Router;
    private authenticationService: Authentication;
    private authorizationService: Authorization;

    constructor(controller: ProductController, authenticationService: Authentication,
            authorizationService: Authorization) {
        this.productController = controller;
        this.authenticationService = authenticationService;
        this.authorizationService = authorizationService;

        this.router = Router();        
        this.initRoutes();
    }

    private initRoutes() {
        const controller = this.productController;
        const authorizationService = this.authorizationService;
        const authenticationService = this.authenticationService;

        this.router.post('/product', controller.createProduct.bind(controller));
        
        this.router.get('/product/:codename', controller.getProduct.bind(controller));

        // this.router.get('/user/me', authenticationService.authenticate.bind(authenticationService),
        //     controller.getMe.bind(controller));

        this.router.get('/products/all', // authenticationService.authenticate.bind(authenticationService),
            // authorizationService.authorize.bind(authorizationService),
            controller.getAllProducts.bind(controller));

        this.router.delete('/product/:codename', controller.deleteProduct.bind(controller));

        this.router.patch('/product/:codename/price/:newPrice', controller.updateProductPrice.bind(controller));

        this.router.patch('/product/:codename/title/:newTitle', controller.updateProductTitle.bind(controller));

        this.router.patch('/product/:codename/description/:newDesc', controller.updateProductDesc.bind(controller));
    }

    public getRouter() : Router {
        return this.router;
    }
}