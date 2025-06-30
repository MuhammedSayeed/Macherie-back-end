import { AnySchema } from 'yup';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const validate = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inputs = { ...req.body, ...req.query, ...req.params };
        await schema.validate(inputs, { abortEarly: true });
        return next();
    } catch (error: any) {
        if (error.name === "ValidationError") {
            const errors = error.errors;
            return next(new AppError(errors, 400));
        }
        return next(new AppError("Validation error", 500));
    }
}