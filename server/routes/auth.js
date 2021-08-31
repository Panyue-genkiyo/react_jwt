import express from "express";
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
//创建一个reset password token
router.put('/passwordreset/:resetToken', resetPassword); //修改


export default router
