import express from 'express'
import * as controller from "./controller"
import { RateLimiter } from '../../middleware/rate-limiter'

const router = express.Router()

router.post("/signup", controller.signup)
router.post("/login", controller.login)
router.post("/forgot-password", RateLimiter({ max: 3 }), controller.forgotPassword)
router.post("/reset-password", controller.resetPassword)
router.get("/me", controller.verifyToken, controller.me)

export default router