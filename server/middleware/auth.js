import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";

export const protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        //格式 Bearer token(1111)
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next(new ErrorResponse(`No authorization to access this route`, 401));
    }

    try{
        //解码 验证签名
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.id);
        if(!user) return next(new ErrorResponse(`No user found with this id`,404));

        req.user = user;

        next(); //中间件
    }catch (e){
        return next(new ErrorResponse(`No authorization to access this route`, 401));
    }
}
