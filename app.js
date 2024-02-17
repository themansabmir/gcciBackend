require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { isAuthenticated } = require("./server/middleware/authentication");
// const { Port } = require("./server/models/portModel");
const GlobalError = require("./server/Errors/GlobalError");
const app = express();
const indexRouter = require("./server/Modules/indexRouter");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(indexRouter); // to manage all routes in one file

app.use("*", (req, res) => {
  res.status(404).json({ msg: "Route doesn't exist" });
});
// app.use(isAuthenticated);


const URI = process.env.MONGODB;
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Mongo Db Connected");
  })
  .catch((err) => console.log(err));

app.use(GlobalError)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
