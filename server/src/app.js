// server/src/app.js

const express = require("express");
const postsRouter = require("./routes/posts");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

app.use("/api/posts", postsRouter);

app.use(errorHandler);

module.exports = app;
