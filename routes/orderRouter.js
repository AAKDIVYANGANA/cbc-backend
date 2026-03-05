import express from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";
import verifyJWT from "../middleware/auth.js"; // ✅ add middleware

const orderRouter = express.Router();

orderRouter.post("/", verifyJWT, createOrder);   // ✅ add verifyJWT
orderRouter.get("/", verifyJWT, getOrders);      // ✅ add verifyJWT

export default orderRouter;