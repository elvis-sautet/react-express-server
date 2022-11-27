const path = require("path");
const fs = require("fs");

let NODE_ENV = "development";
// log if we are in production or development
const logEnv = () => {
  if (process.env.NODE_ENV === "production") {
    console.log("We are in production");
    NODE_ENV = "production";
  } else {
    console.log("We are in development");
    NODE_ENV = "development";
  }
};

logEnv();

const dotenvFile = require("dotenv").config({
  path: `.env.${NODE_ENV}`,
});

const { PORT, API_PREFIX } = process.env;

module.exports = {
  port: PORT,
  apiPrefix: API_PREFIX,
};
