require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { isAuthenticated } = require("./server/middleware/authentication");
const { Port } = require("./server/models/portModel");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(cookieParser());
// app.use(isAuthenticated);
// app.use("/api", require("./server/routes/shipmentRouter"));
app.use("/api", require("./server/routes/employeeRouter"));
app.use("/api", require("./server/routes/addressRoute"));
app.use("/api", require("./server/routes/portRoute"));
app.use("/api", require("./server/routes/hblrouter"));
app.use("/api", require("./server/routes/shipmentRouter"));
app.use("/api", require("./server/routes/taskRouter"));
app.use("/api", require("./server/routes/mblRouter"));
app.use("/api", require("./server/routes/departmentRouter"));
app.use("/api", require("./server/routes/reminderRoute"));
app.use("/api", require("./server/routes/shipmentInsightRouter"));

app.use("/api", require("./server/routes/customerRoute"));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
