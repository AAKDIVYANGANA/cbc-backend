import express from 'express';
import { saveUser, loginUser, googleLogin } from '../controllers/userController.js'; // ✅ added googleLogin

const userRouter = express.Router();

userRouter.post("/", saveUser);
userRouter.post("/login", loginUser);
userRouter.post("/google", googleLogin); // ✅ now works

export default userRouter;