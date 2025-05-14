import express from 'express';
import myRouter from './app-routes/myRoute';
import dotenv from 'dotenv';
import { PORT } from './config/config';

dotenv.config();
const app = express();

const port = PORT ?? 4000;

app.use(express.json());

////////////////////////////
// ROUTES                 //
////////////////////////////
app.use('/my-route', myRouter);

app.listen(port, () => console.log (`Server is now running at port ${port}`))