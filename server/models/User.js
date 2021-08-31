import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [ true, '请提供用户名' ]
    },
    email:{
        type: String,
        required: [true, '请提供邮件'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            '请提供正确的邮箱地址'
        ]
    },
    password:{
        type: String,
        required: [ true, '请提供密码' ],
        minlength: 6,
        select: false //在每次查找之前不让它显示出来
    },
    resetPasswordToken: String, //reset password token
    resetPasswordExpire: Date //过期时间
});

//中间件
//在保存之前
userSchema.pre('save', async function (next){
    //this代表将要保存的文档
   if(!this.isModified('password')){
       next(); //如果密码没有改变
   }
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt); //加盐
   next()
});

//静态方法 在schema上
userSchema.methods.matchPassword = async function(password){
    //解码
    //this代表我们选出来的model
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.getSignedToken = function(){
   return jwt.sign({
       id: this._id
   }, process.env.JWT_SECRET, {
       expiresIn: process.env.JWT_EXPIRE
   })
};

userSchema.methods.getResetPasswordToken = function (){
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * ( 60 * 1000 );

    return resetToken;
}


const User = mongoose.model('User', userSchema);

export default User;

