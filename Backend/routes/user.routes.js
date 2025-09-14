
import express from 'express';
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";


const router = express.Router();

// register
router.post('/register',registerUser);
// login
router.post('/login', loginUser);
// logout
router.get('/logout', logoutUser);

export default router;