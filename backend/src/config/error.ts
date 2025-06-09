
// type interface for error handling
type ApiErrorResponse = {
    message: string;
    statusCode: number;
};
//     error: string;

// custom error handler for validation
class ApiError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}