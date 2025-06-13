const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = (req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFile(path.join(logsDir, 'requests.log'), log, (err) => {
    if (err) console.error('Error writing to log file', err);
  });
  next();
};

module.exports = logger;