import express from 'express';
import * as controller from "./controller";
import { verifyToken } from '../user/controller';

const router = express.Router();

router.get("/", verifyToken, controller.getCart);
router.post("/", verifyToken, controller.addToCart);
router.post("/sync", verifyToken, controller.syncCart);
router.put("/", verifyToken, controller.removeFromCart);
router.put("/qty", verifyToken, controller.updateQTYofItem);
router.delete("/", verifyToken, controller.clearCart);


export default router;