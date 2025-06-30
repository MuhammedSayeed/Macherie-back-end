import * as yup from 'yup';

// Reusable field schemas
const nameSchema = yup
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(26, 'Category name must not exceed 26 characters')
    .required('Category name is required');

const imageSchema = yup
    .string()
    .required('Image URL is required');

const idSchema = yup
    .string()
    .required('Category ID is required');

// Full object schemas
const addCategorySchema = yup.object({
    name: nameSchema,
    image: imageSchema,
});

const deleteCategorySchema = yup.object({
    id: idSchema,
});

const updateCategorySchema = yup.object({
    id: idSchema,
    name: nameSchema,
    image: imageSchema,
});

export {
    addCategorySchema,
    deleteCategorySchema,
    updateCategorySchema,
}
