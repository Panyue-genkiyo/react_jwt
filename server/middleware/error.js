import ErrorResponse from "../utils/errorResponse.js";

//中间件
const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;

    console.log(err);

    if(error.code === 11000){
        const message = `Duplicate field value enter`;
        error = new ErrorResponse(message,400);
    }
    if(error.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server Error"
    });
}

export default errorHandler;
