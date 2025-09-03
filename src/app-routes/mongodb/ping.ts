import express, { Router } from "express";
import { testMongoDbController, testMongoDbController2 } from "../../app-controllers/mongodb/test";

const MongodbRoute: Router = express.Router();

MongodbRoute.get("/ping", (req, res) => {
    console.log("Request Method", req.method);
    res.status(200).json({message: "Connected to mongo db route."});
});

MongodbRoute.get("/route-1", testMongoDbController);
MongodbRoute.get("/route-2", testMongoDbController2);

export default MongodbRoute;