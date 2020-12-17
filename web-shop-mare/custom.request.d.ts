import { Request } from 'express';
import { IUserEntity } from './src/entities/UserEntity';

declare global {
  namespace Express {
    export interface Request {
      user?: IUserEntity
    }
  }
}