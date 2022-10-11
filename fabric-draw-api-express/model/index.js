const mongoose = require("mongoose");
const ip = "139.224.69.197";
const port = 27017;
const dbName = "mukun";

// connect
mongoose.connect(`mongodb://${ip}:${port}/${dbName}`, {
  useNewUrlParser: true,
});

// connect success
mongoose.connection.on("connected", () => {
  console.log("mongoose connection success");
});

// connect error
mongoose.connection.on("error", (error) => {
  console.log(`mongoose connection error: ${error}`);
});

// disconnect
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection disconnected");
});

module.exports = {
  Album: mongoose.model("album", require("./album"), "album"),
};
// module.exports = mongoose;
