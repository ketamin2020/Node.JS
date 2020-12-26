const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const { startDB } = require("./contacts/contact.helpers");
const ContactRouter = require("./contacts/contacts.routes");
const { handleError } = require("./contacts/contact.errorHeandler");
require("dotenv").config();

module.exports = class ContactServer {
  constructor() {
    this.server = null;
  }

  async startServer() {
    this.initServer();
    this.initMiddlwares();
    this.initRoutes();
    await this.initStartDatabase();
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

  async initStartDatabase() {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };
    try {
      await mongoose.connect(process.env.MONGODB_URL, options);
      console.log(startDB);
    } catch (error) {
      process.exit(1);
    }
  }

  startListening() {
    this.server.listen(process.env.PORT || 3000);
  }
};
