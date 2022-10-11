const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./router");
const errorHandler = require("./middleware/error-handler");
require("./model");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(errorHandler());
app.use("/", router);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at http://loaclhost:${PORT}`);
});
