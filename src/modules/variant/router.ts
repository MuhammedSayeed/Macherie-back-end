import express from 'express';
import * as controller from './controller';

const router = express.Router();

router.post("/", controller.addVariant)

export default router;