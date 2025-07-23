import * as yup from 'yup';
import { idSchema } from './id';

// Reusable field schemas
const nameSchema = yup
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(26, 'Category name must not exceed 26 characters')
    .required('Category name is required');





// Full object schemas
const addCategorySchema = yup.object({
    name: nameSchema,
});

const deleteCategorySchema = yup.object({
    id: idSchema('Category'),
});

const updateCategorySchema = yup.object({
    id: idSchema('Category'),
    name: nameSchema,
});

export {
    addCategorySchema,
    deleteCategorySchema,
    updateCategorySchema,
}
