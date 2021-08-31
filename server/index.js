import express from 'express';
import dotenv from 'dotenv';
import router from "./routes/auth.js";
import privateRoute from "./routes/private.js";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/error.js";

dotenv.config({
    path: './.env'
});

//连接数据库
connectDB();

const app = express();
app.use(express.json());
//路由
app.use('/api/auth', router);
app.use('/api/private', privateRoute);

//抓取错误应该是中间件的最后一部分
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT,() =>  console.log(`Server running on port ${PORT}`));

process.on('unhandledRejection', (error, promise) => {
    console.log(`log error: ${error}`);
    server.close(() => process.exit(1));
})



