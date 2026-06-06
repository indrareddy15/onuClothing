import ErrorHandler from '../utility/errorhandel.js';

export default(err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Multer file size limit error
    if (err.code === 'LIMIT_FILE_SIZE') {
        const limitMb = (process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE, 10) : 52428800) / (1024 * 1024);
        err.statusCode = 413;
        err.message = `File too large. Maximum size allowed is ${limitMb}MB.`;
    }

    if(err.name === 'casterror'){
        const message = `resource not found .invalid ${err?.path}`;
        err = new ErrorHandler (message, 400)
    }

    // Duplicate key error in mongoose

    if (err.code == 11000) {
        const message = `Duplicate ${object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler (message, 400)
    }

    // Wrong token entered

    if (err.name == "JsonWebTokenError") {
        const message = `Json Web Token is invalid, try again..`;
        err = new ErrorHandler (message, 400)
    }

    //Token Expire Error

    if (err.name == "TokenExpiredError") {
        const message = `Json Web Token Expired, try again..`;
        err = new ErrorHandler (message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}; 