require("@babel/register");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { connectDatabase } = require("./config/connectDb");
const { authenticate } = require("./src/middleware/authenticate");
const { apiRouter } = require("./src/routes/apiRoutes");
const { publicRouter } = require("./src/routes/publicRoutes");
const { ValidationError } = require("express-validation");
const {
  validationErrorMessageConverter,
  responseMethod,
} = require("./src/utils/common");
const { responseCode, responseMessage } = require("./config/constant");
const { MulterError } = require("multer");

const port = process.env.PORT;
connectDatabase();
require("./src/utils/socket.io");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use("/pub", publicRouter);
app.use("/api", authenticate, apiRouter);
app.use("/mob/pub", publicRouter);
app.use("/mob/api", authenticate, apiRouter);

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return validationErrorMessageConverter(req, res, err);
  }
  if (err instanceof MulterError) {
    return responseMethod(
      res,
      responseCode.BAD_REQUEST,
      err?.message || responseMessage.BAD_REQUEST
    );
  }
  return responseMethod(
    res,
    responseCode.INTERNAL_SERVER_ERROR,
    responseMessage.INTERNAL_SERVER_ERROR
  );
});

app.listen(port, () => console.log("App is listening at", port));

module.exports = app;
