// middlewares/rateLimiter.ts
import rateLimit from "express-rate-limit";
import { RequestHandler } from "express";

interface RateLimiterOptions {
    windowMs?: number;
    max?: number;
    message?: string;
}

export const RateLimiter = ({ windowMs = 15 * 60 * 1000, max = 5, message = "Too many requests", }: RateLimiterOptions): RequestHandler => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message,
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};
