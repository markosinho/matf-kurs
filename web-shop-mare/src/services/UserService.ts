import { UserEntity } from '../entities/UserEntity';
import { UserRepo } from '../repositories/UserRepo';

export class UserService {
    private userRepo: UserRepo;

    constructor(userRepo: UserRepo) {
        this.userRepo = userRepo;
    }

    public async save(user: UserEntity) {
        return this.userRepo.save(user);
    }

    public async findByUserName(userName: string) {
        return this.userRepo.findByUserName(userName);
    }

    public async findByUserId(userId: string) {
        return this.userRepo.findById(userId);
    }

    // TODO: Fix argument types
    public async confirmRegistration(userName: any, registrationToken: any) {
        // Find by username
        const user = await this.userRepo.findByUserName(userName);

        if (user === undefined) {
            return undefined;
        }
        
        user.registrationConfirmed = user.registrationToken === registrationToken;
        return this.save(user);
    }

    public async findAll() {
        return this.userRepo.findAll();
    }
}