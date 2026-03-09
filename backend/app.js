const express = require("express");
const cors = require("cors");
const propertyRouter = require("./routes/propertyRouter");
const userRouter = require("./routes/userRouter");
const { unknownEndpoint, errorHandler, requestLogger } = require("./middleware/customMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/api/properties", propertyRouter);
app.use("/api/users", userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
