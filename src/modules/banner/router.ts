import express from 'express';
import * as controller from "./controller"

const router = express.Router();

router.get('/:value', controller.getBanner)
router.post('/', controller.addBanner)


export default router;
