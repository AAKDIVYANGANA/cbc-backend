import express from 'express';
import {
    saveUser,
    loginUser,
    googleLogin,
    getCurrentUser,
    getAllUsers,
    updateUserRole,
    deleteUser,
} from '../controllers/userController.js';
import verifyJWT from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post("/", saveUser);
userRouter.post("/login", loginUser);
userRouter.post("/google", googleLogin);
userRouter.get("/current", verifyJWT, getCurrentUser);
userRouter.get("/all", verifyJWT, getAllUsers);           // ← get all users
userRouter.put("/:id", verifyJWT, updateUserRole);        // ← update role
userRouter.delete("/:id", verifyJWT, deleteUser);         // ← delete user

export default userRouter;
