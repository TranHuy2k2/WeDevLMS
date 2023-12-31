#!/usr/bin/env node

/**
 * Module dependencies.
 */
require("dotenv").config();
var app = require("../app");
var debug = require("debug")("auth-service:server");
var http = require("http");
const Eureka = require("eureka-js-client").Eureka;
const Sequelize = require("sequelize").Sequelize;
const config = require("../config");
const sequelize = require("../services/sequelizeService");

require("../models/User");
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "8181");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  createEurekaClient();
  setUpDatabase();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function createEurekaClient() {
  const eurekaClient = new Eureka({
    // application instance information
    instance: {
      app: "auth-service",
      hostName: "localhost",
      ipAddr: "127.0.0.1",
      statusPageUrl: "http://localhost:8181",
      port: {
        $: 8181,
        "@enabled": "true",
      },
      vipAddress: "localhost",
      dataCenterInfo: {
        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        name: "MyOwn",
      },
    },
    eureka: {
      // eureka server host / port
      host: "localhost",
      port: 8761,
      servicePath: "/eureka/apps/",
    },
  });
  eurekaClient.start();
}

async function setUpDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({});
    console.log("Connection to DB has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
}
