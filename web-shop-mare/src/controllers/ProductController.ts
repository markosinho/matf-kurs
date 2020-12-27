
import { Request, Response, NextFunction } from 'express';

import { ProductEntity } from '../entities/ProductEntity';

import { ProductService } from '../services/ProductService';

import winston from 'winston';
import bcrypt from 'bcrypt';
import { Security } from '../utils/Security';
import jwt from 'jsonwebtoken';
import { UserType } from '../enums/UserType';

export class ProductController {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    public async createProduct(req: Request, res: Response, next: NextFunction) {
        // Log request
        winston.info(`Create product | ${JSON.stringify(req.body)}`);

        if (!req.body) {
            res.status(400).send();
        }

        try {
            const productExists = await this.productService.findByTitle(req.body.title);
            if (productExists) {
                res.status(400).send(`Product ${req.body.title} exists`);
            }
        } catch (err) {
            winston.error(`Fetching product failed`);
        }

        // TODO: Validate input

        const product = new ProductEntity();
        product.codename = req.body.codename;
        product.title = req.body.title;
        product.description = req.body.description;
        product.price = req.body.price;
        product.category = req.body.category;

        let serviceResponse;
        try {
            serviceResponse = await this.productService.save(product);
            const response = {
                message: "Product created",
                entity: serviceResponse
            }

            res.status(201).send(response);
        } catch (err) {
            winston.error(`Failed to create product: ${err.stack}`);
            res.status(500).send();
        }
    }

    public async getAllProducts(req: Request, res: Response, next: NextFunction) {
        winston.info('Get all products');
        try {
            const allProducts = await this.productService.findAll();
            res.status(200).send(allProducts);
        } catch (err) {
            winston.error(`Failed to get all products`);
            res.status(500).send();
        }
    }

    public async getProduct(req: Request, res: Response, next: NextFunction) {
        winston.info(`Get product by codename: ${JSON.stringify(req.params)}`);
        
        let serviceResponse;
        try {
            serviceResponse = await this.productService.findByCodename(req.params.codename);
            res.status(200).send(serviceResponse);
        } catch (err) {
            winston.error(`Product not found, ${err.stack}`);
            res.status(404).send();
        }
    }

    public async deleteProduct(req: Request, res: Response, next: NextFunction) {
        winston.info(`Delete product by codename: ${JSON.stringify(req.params)}`);
        
        let serviceResponse;
        try {
            serviceResponse = await this.productService.deleteByCodename(req.params.codename);
            res.status(200).send();
        } catch (err) {
            winston.error(`Product not found, ${err.stack}`);
            res.status(404).send();
        }
    }

    public async updateProductPrice(req: Request, res: Response, next: NextFunction) {
        winston.info(`Update product price by product codename: ${JSON.stringify(req.params)}`);

        let serviceResponse;
        try {
            const product = await this.productService.findByCodename(req.params.codename);
            if (!product) {
                winston.error(`Product not found, ${req.params.codename}`);
                res.status(404).send();
                return;
            }

            product.price = parseInt(req.params.newPrice);

            serviceResponse = await this.productService.save(product);
            res.status(200).send();
        } catch (err) {
            winston.error(`Product not found, ${err.stack}`);
            res.status(400).send();
        }
    }

    public async updateProductTitle(req: Request, res: Response, next: NextFunction) {
        winston.info(`Update product title by product codename: ${JSON.stringify(req.params)}`);

        let serviceResponse;
        try {
            const product = await this.productService.findByCodename(req.params.codename);
            if (!product) {
                winston.error(`Product not found, ${req.params.codename}`);
                res.status(404).send();
                return;
            }

            product.title = req.params.newTitle;

            serviceResponse = await this.productService.save(product);
            res.status(200).send();
        } catch (err) {
            winston.error(`Product not found, ${err.stack}`);
            res.status(400).send();
        }
    }

    public async updateProductDesc(req: Request, res: Response, next: NextFunction) {
        winston.info(`Update product description by product codename: ${JSON.stringify(req.params)}`);

        let serviceResponse;
        try {
            const product = await this.productService.findByCodename(req.params.codename);
            if (!product) {
                winston.error(`Product not found, ${req.params.codename}`);
                res.status(404).send();
                return;
            }

            product.description = req.params.newDesc;

            serviceResponse = await this.productService.save(product);
            res.status(200).send();
        } catch (err) {
            winston.error(`Product not found, ${err.stack}`);
            res.status(400).send();
        }
    }
}