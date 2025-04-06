const os = require("os");
const path = require("path");
const logEvent = require("./logEvents");
const EventEmitter = require("events");

class Logger extends EventEmitter { 
  log(...args) {
    this.emit("log", ...args);
  }
};

const logger = new Logger();

logger.on("log", (...args) => {
  logEvent("log.txt", ...args);
});

setTimeout(() => {
  logger.log("Server is running...");

  logger.log("OS Type:", os.type());
  logger.log("OS Version:", os.version());
  logger.log("Home Directory:", os.homedir());
  logger.log("OS Platform:", os.platform());
  logger.log("OS Architecture:", os.arch());
  logger.log("OS Release:", os.release());
  logger.log("OS Hostname:", os.hostname());
  logger.log("OS Uptime:", os.uptime(), "seconds");

  logger.log("log", "Log event emitted!");
}, 2000);





