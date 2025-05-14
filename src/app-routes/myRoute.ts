import express, { Router } from "express";
import { myController1, myController2 } from "../app-controllers/myController";

const myRouter: Router = express.Router();
// const myController = require("../controllers/myController");

myRouter.get("/ping", (req, res) => {
    console.log("Request Method", req.method);
    res.status(200).json({message: "Connected to my route."});
});

myRouter.get("/controller-1", myController1);
myRouter.get("/controller-2", myController2);

export default myRouter;