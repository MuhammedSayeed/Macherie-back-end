import express from "express"
import * as controller from "./controller"
import { verifyToken } from "../user/controller";

const router = express();


router.post("/", verifyToken, controller.addShippingAddress)
router.get("/", verifyToken, controller.getShippingAddress)


export default router;