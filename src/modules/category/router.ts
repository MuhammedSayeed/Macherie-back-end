import express from 'express';
import * as controller from "./controller"
import { validate } from '../../middleware/validation';
import { addCategorySchema, deleteCategorySchema, updateCategorySchema } from '../../validation/category';
const router = express.Router();

router.get('/', controller.getCategories)
router.post('/', validate(addCategorySchema), controller.addCategory)
router.delete('/:id', validate(deleteCategorySchema), controller.deleteCategory)
router.put('/:id' , validate(updateCategorySchema), controller.updateCategory)



export default router;