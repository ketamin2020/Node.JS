require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const ContactRouter = require("./modules/contacts/contacts.routes");
const UserRouter = require("./modules/users/users.router");

module.exports = class ContactServer {
  constructor() {
    this.server = null;
  }

  async startServer() {
    this.initServer();
    await this.initStartDatabase();
    this.initMiddlwares();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlwares() {
    this.server.use(express.static("public"));
    this.server.use(express.json());
    this.server.use(morgan("dev"));
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }
  initRoutes() {
    this.server.use("/api/contacts", ContactRouter);
    this.server.use("/api/auth", UserRouter);
  }

  async initStartDatabase() {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };
    try {
      await mongoose.connect(process.env.MONGODB_URL, options);
      console.log("the database started working");
    } catch (error) {
      process.exit(1);
    }
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log(`Server started listening on ${process.env.PORT} port`);
    });
  }
};
