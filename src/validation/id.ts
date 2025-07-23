import * as yup from 'yup';



export const idSchema = (type: string) => {
    return yup.string()
        .matches(/^[a-f\d]{24}$/i, `Invalid ${type} id`)
        .required(`${type} id is required`);
}

