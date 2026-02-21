import express from 'express';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/productController.js';
import verifyJWT from '../middleware/auth.js';

const productRouter = express.Router();

productRouter.post("/", verifyJWT, createProduct);
productRouter.get("/", getProducts);
productRouter.delete("/:productId", verifyJWT, deleteProduct);
productRouter.put("/:productId", verifyJWT, updateProduct);

export default productRouter;