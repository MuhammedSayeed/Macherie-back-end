import express, { Request, Response, Application } from 'express';
import { dbConnection } from './databases/connection';
import dotenv from 'dotenv';
import categoryRouter from './modules/category/router';
import { globalErrorMiddleware } from './middleware/globalErrorMiddleware';
import cors from 'cors';

dotenv.config();
const ENDPOINTBASE = "/api/v1";

const app: Application = express();


app.use(cors({
    origin : "http://localhost:3000",
    methods : ["GET", "POST", "PUT", "DELETE"],
}))

app.use(express.json());
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
})
app.use(`${ENDPOINTBASE}/categories`, categoryRouter)

app.use(globalErrorMiddleware)



dbConnection();

app.listen(process.env.PORT || 3001, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
})