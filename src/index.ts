import express from 'express';
import cors from 'cors';  
import myRouter from './app-routes/myRoute';
import dotenv from 'dotenv';
import { MONGODB_URI_S1, PORT } from './config/config';
import productRouter from './app-routes/products';
import cookieParser from 'cookie-parser';
import imageRouter from './app-routes/images';
import mongoose from 'mongoose';
import MongodbRoute from './app-routes/mongodb/ping';

dotenv.config();
const app = express();
const port = PORT ?? 4000;

////////////////////////////
// MONGODB                //
////////////////////////////
const mongoDbUri = MONGODB_URI_S1;
mongoose.connect(mongoDbUri.toString());

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => console.log('Connected to MongoDB'));

////////////////////////////
// APP SETUP              //
////////////////////////////
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
app.use('/images', imageRouter);
app.use('/mongodb', MongodbRoute)

app.listen(port, () => console.log (`Server is now running at port ${port}`))