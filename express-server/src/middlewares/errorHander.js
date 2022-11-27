const path = require("path");
const fs = require("fs");

const errorHandler = (err, req, res, next) => {
  //for a production ready application, you should log the error to a file or database
  const error = {
    name: err.name,
    message: err.message,
    stack: err.stack,
    origin: req.headers.origin === undefined ? "localhost" : req.headers.origin,
  };

  logError(error);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message,
  });
};

// a function to log errors to a file or database
const logError = (error) => {
  console.log(error);

  //get the folder path for the log file
  const logPath = path.join(__dirname, "../logs/error.log");

  //if the log file does not exist, create it
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, "");
  }

  //get the current date and time
  const date = new Date();

  //get the current date and time in the format: 2020-01-01 00:00:00
  const dateTime = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  //get the error message
  const errorMessage = `${dateTime} - ${error.name}: ${error.message} - ${error.stack} - ${error.origin}`;

  //append the error message to the log file
  fs.appendFileSync(logPath, errorMessage + "\r \n");
};

module.exports = errorHandler;
