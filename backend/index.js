require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const holdingsRoute = require("./routes/holdingsRoute");
const positionsRoute = require("./routes/positionsRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");

app.use(cors());
app.use(bodyParser.json());

app.use("/holdings", holdingsRoute);
app.use("/positions", positionsRoute);
app.use("/user", userRoute);
app.use("/orders", orderRoute);

const startServer = async () => {
  try {
    if (!uri) {
      throw new Error("MONGO_URL is missing in backend .env");
    }

    await mongoose.connect(uri);
    console.log("DB Connected");

    app.listen(port, () => {
      console.log(`App Is listening On ${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
