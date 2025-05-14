import express from 'express';
import myRouter from './app-routes/myRoute';

const app = express();

const port = process.env.PORT ?? 4000;

app.use(express.json());

////////////////////////////
// ROUTES                 //
////////////////////////////
app.use('/my-route', myRouter);

app.listen(port, () => console.log (`Server is now running at port ${port}`))