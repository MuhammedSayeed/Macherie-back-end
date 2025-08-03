import express, { Request, Response, Application } from 'express';
import { dbConnection } from './databases/connection';
import dotenv from 'dotenv';
dotenv.config();

import categoryRouter from './modules/category/router';
import styleRouter from './modules/style/router';
import bannerRouter from './modules/banner/router';
import productRouter from './modules/product/router';
import variantRouter from './modules/variant/router';
import userRouter from './modules/user/router';
import cartRouter from './modules/cart/router';
import shippingAddressRouter from './modules/shippingAddress/router';
import { globalErrorMiddleware } from './middleware/globalErrorMiddleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const ENDPOINTBASE = "/api/v1";

const app: Application = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', "token"],
    exposedHeaders: ['Set-Cookie']
}))
app.use(cookieParser());
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
})
app.use(`${ENDPOINTBASE}/categories`, categoryRouter)
app.use(`${ENDPOINTBASE}/styles`, styleRouter)
app.use(`${ENDPOINTBASE}/banners`, bannerRouter)
app.use(`${ENDPOINTBASE}/products`, productRouter)
app.use(`${ENDPOINTBASE}/variants`, variantRouter)
app.use(`${ENDPOINTBASE}/users`, userRouter)
app.use(`${ENDPOINTBASE}/cart`, cartRouter)
app.use(`${ENDPOINTBASE}/shippingAddress`, shippingAddressRouter)

app.use(globalErrorMiddleware)



dbConnection();

app.listen(process.env.PORT || 3001, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
})