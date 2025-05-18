import express, { Router } from "express";
import { getImageById } from "../app-controllers/images";

const imageRouter: Router = express.Router();
// const myController = require("../controllers/myController");

imageRouter.get("/ping", (req, res) => {
    console.log("Request Method", req.method);
    res.status(200).json({message: "Connected to my route."});
});

imageRouter.get("/", getImageById);
imageRouter.get("/:id", getImageById);

export default imageRouter;