import express from 'express';
import * as controller from './controller';
const router = express.Router();


router.post("/", controller.addProduct)
router.get("/variant/:id/:color", controller.getProduct)
router.get("/:category/:style", controller.getProducts)
router.get("/availability/:id/:size/:quantity", controller.checkAvailability)



export default router;