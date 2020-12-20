const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const ContactRouter = require("./contacts/contacts.routes");
const {
  handleError,
  ErrorHandler,
} = require("./contacts/contact.errorHeandler");

module.exports = class Contact {
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
    this.server.use(morgan("dev"));
    this.server.use(cors({ origin: "http://localhost:3000" }));
    this.server.use((err, req, res, next) => {
      handleError(err, res);
    });
  }
  initRoutes() {
    this.server.use("/api/contacts", ContactRouter);
  }
  startListening() {
    this.server.listen(process.env.PORT || 3000);
  }
};
