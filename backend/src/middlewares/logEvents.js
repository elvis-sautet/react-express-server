const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logsDir = path.join(__dirname, "../logs");

// if the logs directory does not exist, create it
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

let logEvents = {
  allLogs: (req, res, next) => {
    const logPath = path.join(__dirname, "../logs/allLogs.log");
    //if the file doesn't exist', create and write to it
    if (!fs.existsSync(logPath)) {
      fs.writeFileSync(logPath, "");
    }
    const date = new Date();
    const dateTime = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const logMessage = `${dateTime} - ${req.method} ${req.url} - ${req.headers.origin}`;
    fs.appendFileSync(logPath, logMessage + "\r \n");
    next();
  },
  errorLogs: (err, req, res, next) => {
    const logPath = path.join(__dirname, "../logs/errorLogs.log");

    if (!fs.existsSync(logPath)) {
      fs.writeFileSync(logPath, "");
    }
    const date = new Date();
    const dateTime = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const logMessage = `${dateTime} - ${err.name}: ${err.message} - ${err.stack} - ${req.headers.origin}`;
    fs.appendFileSync(logPath, logMessage + "\r \n");
    next();
  },
};

module.exports = logEvents;
