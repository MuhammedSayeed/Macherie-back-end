
import { NextFunction, Request, Response } from "express";

export const globalErrorMiddleware = (err: { message: string, statusCode: number }, req: Request, res: Response, next: NextFunction) => {
    const { message, statusCode } = err;
    res.status(statusCode || 500).json({
        success: false,
        message: message || "Internal Server Error"
    })
}