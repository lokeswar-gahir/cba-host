const { constants } = require("../constants");
const errorHandler = (err, req, res, next)=>{
    const statusCode = res.statusCode ? res.statusCode: 500;
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({title : "Validation Failed", message: err.message, stackTrace: err.stack });
            break;

        case constants.UNAUTHORIZED:
            res.json({title : "Unauthorized", message: err.message, stackTrace: err.stack });
            break;
        case constants.FORBIDDEN:
            res.json({title : "Forbidden", message: err.message, stackTrace: err.stack });
            break;
        case constants.NOT_FOUND:
            res.json({title : "Not Found", message: err.message, stackTrace: err.stack });
            break;
        case constants.SERVER_ERROR:
            res.json({title : "Server error", message: err.message, stackTrace: err.stack });
            break;
        // case constants.NO_INTERNET:
        //     res.json({title : "Server error", message: err.message, stackTrace: err.stack });
        //     console.log("Make sure you are connected to internet.")
        //     break;
    
        default:
            console.log(statusCode,": Unknown Error!!!");
            res.json({ Code: statusCode, title: "Unknown error", message: err.message, stackTrace: err.stack});
            break;
    }
    
    // res.send("error."); 
};

module.exports = errorHandler;