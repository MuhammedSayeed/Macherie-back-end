import * as yup from 'yup';


const getStylesSchema = yup.object({
    category: yup
        .string()
        .required('Category is required'),
});

const addStyleSchema = yup.object({
    name: yup
        .string()
        .min(2, 'Style name must be at least 2 characters')
        .max(16, 'Style name must not exceed 16 characters')
        .matches(/^[A-Z]/, 'Style name must start with a capital letter')
        .required('Style name is required'),

    category: yup
        .string().matches(/^[a-f\d]{24}$/i, 'Invalid category ID')
        .required('Category ID is required'),
});




export {
    addStyleSchema,
    getStylesSchema
}