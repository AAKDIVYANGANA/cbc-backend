import express from 'express';
import { createProduct, deleteProduct, getProducts, updateProduct, getProductById } from '../controllers/productController.js';
import verifyJWT from '../middleware/auth.js';

const productRouter = express.Router();

productRouter.post("/", verifyJWT, createProduct);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.delete("/:productId", verifyJWT, deleteProduct);
productRouter.put("/:productId", verifyJWT, updateProduct);

export default productRouter;