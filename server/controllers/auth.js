import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

export const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    try{
      const user = await User.create({
          username,
          email,
          password
      });
      sendToken(user,201,res);
    }catch (e){
        next(e);
    }
}


export const login = async (req, res, next) => {
    // res.send('Login route');
    const { email, password } = req.body;
    if(!email || !password) return next(new ErrorResponse(`please provide email or password`, 400));
    try{
        const user = await User.findOne({ email }).select("+password"); //选出password
        if(!user) return next(new ErrorResponse(`Invalid credentials`, 401)); //user not found
        //比较密码
        const isMatch = await user.matchPassword(password);

        if(!isMatch) return next(new ErrorResponse(`Invalid credentials`, 401));
        //创建token
        sendToken(user,200,res);
    }catch (error){
       next(error);
    }
}


export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try{
        const user = await User.findOne({ email });
        if(!user) return new ErrorResponse(`Email couldn't be sent(doesn't exist)`, 404);
        const restToken = user.getResetPasswordToken();
        await user.save();
        const resetUrl = `http://localhost:3000/passwordreset/${restToken}`;
        const message = `
           <h1>you have requested a password reset</h1>
           <p>please go to this link to reset your password</p>
           <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;
        // sendEmail
        try{
           await sendEmail({
               to: user.email,
               subject:`Password reset request(10min)`,
               text:message
           });
           res.status(200).json({
               success: true,
               data: 'email sent'
           });
        }catch (error){
             user.resetPasswordToken = undefined;
             user.resetPasswordExipre = undefined;
             await user.save();
             return next(new ErrorResponse(`Email couldn't be sent`, 500))
        }

    }catch (error){
        next(error);
    }
}


export const resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");

    try{
       const user = await User.findOne({
           resetPasswordToken,
           resetPasswordExpire: {
               $gt: Date.now() //大于现在的时间防止过期
           }
       });

       if(!user) return next(new ErrorResponse(`Invalid reset token`, 400));

       user.password = req.body.password;
       user.resetPasswordToken = undefined;
       user.resetPasswordExpire = undefined;
       await user.save();

       res.status(201).json({
           success: true,
           data:`Password reset success`
       });
    }catch (error){
        next(error)
    }

}

const sendToken = async (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({
        success: true,
        token
    })
}
