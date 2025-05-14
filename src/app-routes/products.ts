import express, { Router } from "express";
import { createNewProduct, deleteProductById, getAllProducts, getProductById, markAsDeleteProductById, updateProduct } from "../app-controllers/products";

const productRouter: Router = express.Router();
// const myController = require("../controllers/myController");

productRouter.get("/ping", (req, res) => {
    console.log("Request Method", req.method);
    res.status(200).json({message: "Connected to my route."});
});

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/create", createNewProduct);
productRouter.put("/update/:id", updateProduct);
productRouter.delete("/delete/:id", deleteProductById);
productRouter.put("/delete/:id", markAsDeleteProductById);

export default productRouter;