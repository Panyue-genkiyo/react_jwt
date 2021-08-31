//隐私路由
import express from "express";
import { protect } from "../middleware/auth.js";

const privateRoute = express.Router();

privateRoute.get('/', protect, (req, res)=>{
    res.status(200).json({
        success: true
    });
});

export default privateRoute;
