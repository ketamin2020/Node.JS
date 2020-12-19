const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRouter = require("./users/contacts.routes");

module.exports = class User {
  constructor() {
    this.server = null;
  }

  startServer() {
    this.initServer();
    this.initMiddlwares();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlwares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }
  initRoutes() {
    this.server.use("/api/contacts", userRouter);
  }
  startListening() {
    this.server.listen(process.env.PORT || 3000);
  }
};
