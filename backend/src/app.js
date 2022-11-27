const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const errorHandler = require("./middlewares/errorHander");
const corsOptions = require("./config/cors");
const morgan = require("morgan");
const { apiPrefix, allowedMethods } = require("./config");
const dotenv = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
const routes = require("./routes");
const logEvents = require("./middlewares/logEvents");

/**Initialize the express application */
const app = express();

// morgan
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";

/**prefix for all routes in the application */

/**This is the port for the application */
const port = process.env.PORT || 2100;

// log all responses of our api and use morgan
app.use((req, res, next) => logEvents.allLogs(req, res, next));
app.use(morgan(morganFormat));

/**Initialize the cors options for the application and secure the application using helmet */
app.use(cors(corsOptions));

app.use(helmet());

/**Get the node environment and set it to the application */
app.set("env", process.env.NODE_ENV);

/** If this up is running behind a proxy, like on Heroku, trust the connection */
app.set("trust proxy", 1);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.set("view engine", "ejs");

/**Compression */
function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

app.use(
  compression({
    filter: shouldCompress,
    level: 9, // set compression level from 1 to 9 (6 by default). We are using 9 because we want to compress the response as much as possible to reduce the size of the response body and increase the speed of the response to the client
  })
);

/* A security measure to prevent attackers from knowing what technology you are using. */
app.disable("x-powered-by");
/* A security measure to prevent attackers from knowing what technology you are using. */
app.disable("etag");

app.use(apiPrefix, routes);

app.get("/", (_req, res) => {
  return res
    .status(200)
    .json({
      resultMessage: {
        en: "Project is successfully working...",
        sw: "Mradi umezishwa na mafinikio...",
      },
      resultCode: "00004",
    })
    .end();
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", allowedMethods);

  // The content security policy is a security measure to prevent attackers from injecting malicious code into your website.
  // it requires you to whitelist the sources of your scripts, stylesheets, images, and other resources. e.g. img is the source of i
  // res.header(
  // 	"Content-Security-Policy",
  // 	"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';"
  // );

  // The X-Frame-Options header is a security measure to prevent clickjacking attacks.
  res.header("X-Frame-Options", "SAMEORIGIN");

  // The X-XSS-Protection header is a security measure to prevent cross-site scripting attacks.
  res.header("X-XSS-Protection", "1; mode=block");

  // The X-Content-Type-Options header is a security measure to prevent MIME type sniffing attacks.
  res.header("X-Content-Type-Options", "nosniff");

  // The Referrer-Policy header is a security measure to prevent leaking the URL of the previous page.
  res.header("Referrer-Policy", "same-origin");

  // The Strict-Transport-Security header is a security measure
  // to prevent
  // 1. SSL stripping attacks
  // 2. It also tells the browser to always use HTTPS when visiting your website.
  res.header(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // The Permissions-Policy header is a security measure to prevent malicious scripts from accessing sensitive information.

  next();
});

// /**This is hit when the route is not found */
app.use((req, res, next) => {
  const error = new Error("🔍🔍🔍 Endpoint could not found!");
  error.status = 404;
  next(error);
});

/**Error handler for the application */
app.use(errorHandler);

module.exports = app;
