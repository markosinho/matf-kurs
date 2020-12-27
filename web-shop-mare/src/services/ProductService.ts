import { ProductEntity } from '../entities/ProductEntity';
import { ProductRepo } from '../repositories/ProductRepo';

export class ProductService {
    private productRepo: ProductRepo;

    constructor(productRepo: ProductRepo) {
        this.productRepo = productRepo;
    }

    public async save(user: ProductEntity) {
        return this.productRepo.save(user);
    }

    public async findByCodename(codename: string) {
        return this.productRepo.findByCodename(codename);
    }

    public async findByTitle(title: string) {
        return this.productRepo.findByTitle(title);
    }

    public async findByProductId(productId: string) {
        return this.productRepo.findById(productId);
    }

    public async findAll() {
        return this.productRepo.findAll();
    }

    public async deleteByCodename(codename: string) {
        return this.productRepo.deleteByCodename(codename);
    }

    public async deleteByTitle(title: string) {
        return this.productRepo.deleteByTitle(title);
    }
}