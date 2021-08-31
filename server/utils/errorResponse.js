class ErrorResponse extends Error{
    constructor(msg, statusCode) {
        super(msg);
        this.statusCode = statusCode;
    }
}

export default ErrorResponse;
