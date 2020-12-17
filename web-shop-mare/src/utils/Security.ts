import bcrypt from 'bcrypt';
import crs from 'crypto-random-string';

const saltRounds = 8;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


export class Security {

    public static secret: string = 'not_bacon_bacon';
    
    public static async generateHash(stringToHash: string) {
        const hash = await bcrypt.hash(stringToHash, saltRounds);
        return hash;
    }

    public static generateRandomString(length: number) {
        return crs({length, type: 'alphanumeric'});
    }

    public static async checkHash(stringToCheck: string, hash: string) {
        return await bcrypt.compare(stringToCheck, hash);
    }
}