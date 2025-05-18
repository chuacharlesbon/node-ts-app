import express from 'express';
import cors from 'cors';  
import myRouter from './app-routes/myRoute';
import dotenv from 'dotenv';
import { PORT } from './config/config';
import productRouter from './app-routes/products';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

const port = PORT ?? 4000;

app.use(cors({
    origin: 'http://localhost:4200',   // Allow this origin only
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    credentials: true                  // Allow cookies/auth headers if needed
  }));

app.use(express.json());
app.use(cookieParser());

////////////////////////////
// ROUTES                 //
////////////////////////////
app.use('/my-route', myRouter);
app.use('/products', productRouter);
// app.use('/products', etagCache, productRouter);

app.listen(port, () => console.log (`Server is now running at port ${port}`))