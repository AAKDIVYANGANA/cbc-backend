import express from 'express';
import { saveUser, loginUser, googleLogin, getCurrentUser } from '../controllers/userController.js';
import verifyJWT from '../middleware/auth.js'; // ✅ add verifyJWT

const userRouter = express.Router();

userRouter.post("/", saveUser);
userRouter.post("/login", loginUser);
userRouter.post("/google", googleLogin);
userRouter.get("/current", verifyJWT, getCurrentUser); // ✅ fix: /Current -> /current + add verifyJWT

export default userRouter;