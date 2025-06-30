import { NextFunction } from 'express';
import { AppError } from './AppError';


const sendError = (next: NextFunction, message: string, statusCode: number) => {
    return next(new AppError(message, statusCode))
}


export default sendError