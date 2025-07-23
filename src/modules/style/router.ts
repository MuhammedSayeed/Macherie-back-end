import express from 'express';
import * as controller from './controller';
const router = express.Router();

router.get('/:category', controller.getStyles)
router.post('/', controller.addStyle)
// // router.delete('/:id')
// // router.put('/:id')



export default router;