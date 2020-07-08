const app = require('./app');
const env = require('../utils/environment');
const debug = require('debug')('nodestr:server');
const http = require('http');
const logger = require(process.cwd() + '/bin/logger.js');
const port = normalizaPort(env.config.SERVER_PORT || '3000');


app.set('port', port);
var server = http.createServer(app);

logger.info("Starting Logs...");

server.listen(process.env.PORT, '0.0.0.0,' () => {
  console.log('..............................................');
  logger.info('Server started!');
  logger.info(`Server started in: ${port}/`);
  console.log('..............................................');
});

server.on('error', onError);
server.on('listening', onListening);

process.on('SIGINT', function () {
  logger.info('Application finished, conection closed!');
  process.exit(0);
});


function normalizaPort(val) {
  const p = parseInt(val, 10);
  if (isNaN(p)) {
    return val;
  }
  if (p >= 0) {
    return p;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof process.env.PORT === 'string'
    ? 'Pipe ' + process.env.PORT
    : 'Port ' + process.env.PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
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
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}