import express from "express";
import { createOrder, getOrders, updateOrder } from "../controllers/orderController.js";
import verifyJWT from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/", verifyJWT, createOrder);
orderRouter.get("/", verifyJWT, getOrders);
orderRouter.put("/:orderId", verifyJWT, updateOrder); // ✅ fix 1: GET -> PUT, added verifyJWT

export default orderRouter;